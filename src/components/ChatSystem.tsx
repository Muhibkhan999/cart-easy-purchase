import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import moment from 'moment';

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  conversation_id: string;
  sender_name?: string;
  sender_email?: string;
}

interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  created_at: string;
}

interface ChatSystemProps {
  currentUserId?: string;
  sellerId?: string;
  productId?: string;
  isVisible?: boolean;
  onToggle?: () => void;
}

const ChatSystem = ({ 
  currentUserId, 
  sellerId, 
  productId, 
  isVisible = false, 
  onToggle 
}: ChatSystemProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUserId && sellerId && productId) {
      initializeConversation();
    }
  }, [currentUserId, sellerId, productId]);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    if (!currentUserId || !sellerId || !productId) return;

    try {
      // Check if conversation exists
      let { data: existingConversation, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('buyer_id', currentUserId)
        .eq('seller_id', sellerId)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!existingConversation) {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('chat_conversations')
          .insert({
            buyer_id: currentUserId,
            seller_id: sellerId,
            product_id: productId,
          })
          .select()
          .single();

        if (createError) throw createError;
        existingConversation = newConversation;
      }

      setConversation(existingConversation);
    } catch (error: any) {
      console.error('Error initializing conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize chat',
        variant: 'destructive',
      });
    }
  };

  const fetchMessages = async () => {
    if (!conversation) return;

    try {
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch sender profiles separately
      const messagesWithProfiles = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('user_id', message.sender_id)
            .single();
          
          return {
            ...message,
            sender_email: profile?.email,
            sender_name: profile?.full_name,
          };
        })
      );

      setMessages(messagesWithProfiles);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const subscribeToMessages = () => {
    if (!conversation) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !currentUserId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: newMessage.trim(),
          conversation_id: conversation.id,
          sender_id: currentUserId,
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Card className={`fixed bottom-4 right-4 w-80 z-50 shadow-xl ${isMinimized ? 'h-16' : 'h-96'} transition-all duration-200`}>
      <CardHeader className="flex flex-row items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat with Seller
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender_id === currentUserId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === currentUserId ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {moment(message.created_at).format('HH:mm')}
                  </p>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-gray-500 text-center text-sm py-8">
                Start a conversation with the seller
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" size="sm" disabled={loading || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
};

export default ChatSystem;