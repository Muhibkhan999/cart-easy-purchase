
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    userType: "buyer" as UserRole
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // User is logged in, redirect to home
          navigate('/');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeChange = (value: string) => {
    setFormData({
      ...formData,
      userType: value as UserRole
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful:', data);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in."
      });

    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password", 
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    if (!formData.fullName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting signup with:', { 
        email: formData.email, 
        userType: formData.userType, 
        fullName: formData.fullName 
      });
      
      // First create user with simple signup
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            user_type: formData.userType,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific database errors
        if (error.message.includes('Database error')) {
          // Try to create profile manually after signup
          if (data.user) {
            try {
              // Insert profile
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  user_id: data.user.id,
                  email: formData.email,
                  full_name: formData.fullName
                });

              if (profileError) {
                console.error('Profile creation error:', profileError);
              }

              // Insert user role
              const { error: roleError } = await supabase
                .from('user_roles')
                .insert({
                  user_id: data.user.id,
                  role: formData.userType
                });

              if (roleError) {
                console.error('Role creation error:', roleError);
              }

              // If seller, create seller profile
              if (formData.userType === 'seller') {
                const { error: sellerError } = await supabase
                  .from('seller_profiles')
                  .insert({
                    user_id: data.user.id,
                    business_name: `${formData.fullName}'s Store`,
                    is_verified: false
                  });

                if (sellerError) {
                  console.error('Seller profile creation error:', sellerError);
                }
              }

              toast({
                title: "Account Created!",
                description: `Welcome to ShopHub! Your ${formData.userType} account has been created.`
              });
            } catch (manualError) {
              console.error('Manual profile creation failed:', manualError);
              toast({
                title: "Account Created",
                description: "Please check your email to verify your account.",
              });
            }
          }
        } else {
          throw error;
        }
      } else {
        console.log('Signup successful:', data);

        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account before logging in."
          });
        } else {
          toast({
            title: "Account Created!",
            description: `Welcome to ShopHub! Your ${formData.userType} account has been created.`
          });
        }
      }

      // Clear form
      setFormData({
        email: "",
        password: "",
        fullName: "",
        confirmPassword: "",
        userType: "buyer" as UserRole
      });

    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.message.includes('already registered')) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please login instead.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sign Up Failed",
          description: error.message || "Failed to create account",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    }
  };

  // If user is already logged in, show logout option
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">You are logged in as:</p>
              <p className="font-semibold text-gray-800">{user.email}</p>
            </div>
            
            <div className="space-y-4">
              <Link to="/" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Go to Home
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="bg-white/90 backdrop-blur-md shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <p className="text-gray-600">
              {isLogin 
                ? "Sign in to your ShopHub account" 
                : "Join ShopHub today"
              }
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required={!isLogin}
                        placeholder="Enter your full name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                      Account Type
                    </label>
                    <Select value={formData.userType} onValueChange={handleUserTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer - Shop for products</SelectItem>
                        <SelectItem value="seller">Seller - Sell your products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      placeholder="Confirm your password"
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ 
                      email: "", 
                      password: "", 
                      fullName: "", 
                      confirmPassword: "",
                      userType: "buyer" as UserRole
                    });
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
