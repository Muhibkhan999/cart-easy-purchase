import { useState, useEffect } from 'react';
import { MessageCircle, Send, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import moment from 'moment';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  product_id: string;
  user_email?: string;
  user_name?: string;
}

interface ProductCommentsProps {
  productId: string;
  userId?: string;
}

const ProductComments = ({ productId, userId }: ProductCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [productId]);

  const fetchComments = async () => {
    try {
      const { data: commentsData, error } = await supabase
        .from('product_comments')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately
      const commentsWithProfiles = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('user_id', comment.user_id)
            .single();
          
          return {
            ...comment,
            user_email: profile?.email,
            user_name: profile?.full_name,
          };
        })
      );

      setComments(commentsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    }
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel('product-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_comments',
          filter: `product_id=eq.${productId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('product_comments')
        .insert({
          content: newComment.trim(),
          product_id: productId,
          user_id: userId,
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('product_comments')
        .update({ content: editContent.trim() })
        .eq('id', commentId);

      if (error) throw error;

      setEditingComment(null);
      setEditContent('');
      toast({
        title: 'Success',
        description: 'Comment updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comment',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('product_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment Form */}
        {userId && (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="resize-none"
              rows={3}
            />
            <Button type="submit" disabled={loading || !newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-gray-900">
                    {comment.user_name || 'Anonymous'}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {moment(comment.created_at).fromNow()}
                    {comment.updated_at !== comment.created_at && ' (edited)'}
                  </span>
                </div>
                {userId === comment.user_id && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingComment(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {editingComment === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductComments;