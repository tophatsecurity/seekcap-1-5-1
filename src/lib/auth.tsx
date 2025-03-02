import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            setUser({
              id: userData.user.id,
              email: userData.user.email || '',
              role: 'user', // Default role
              created_at: userData.user.created_at || '',
            });
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session);
        
        if (event === "SIGNED_IN" && session) {
          try {
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
              setUser({
                id: userData.user.id,
                email: userData.user.email || '',
                role: 'user', // Default role
                created_at: userData.user.created_at || '',
              });
              navigate("/");
            }
          } catch (err) {
            console.error("Error getting user after sign in:", err);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          navigate("/auth");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error from Supabase:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("Signed in successfully:", data.user);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role: 'user', // Default role
          created_at: data.user.created_at || '',
        });
        
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Re-throw for handling in the component
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Signing up with:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      console.log("Sign up response:", data);
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Re-throw for handling in the component
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast({
        title: "Signed out successfully",
      });
      navigate("/auth");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
