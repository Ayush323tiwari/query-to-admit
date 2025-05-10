
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, UserRole } from "./types";
import { toast } from "@/components/ui/sonner";
import { supabase, isSupabaseConfigured } from "./supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  // Check for active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if Supabase is properly configured
        if (!isSupabaseConfigured()) {
          console.warn('Supabase is not properly configured. Using development mode.');
          setLoading(false);
          setIsConfigured(false);
          return;
        }

        setIsConfigured(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            setLoading(false);
            return;
          }

          if (userData) {
            setUser({
              id: userData.id,
              name: userData.name || userData.full_name || session.user.email?.split('@')[0] || '',
              email: session.user.email!,
              role: userData.role as UserRole,
              avatar: userData.avatar_url,
              phone: userData.phone,
              address: userData.address
            });
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession) {
        // Fetch user profile data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user data on auth change:', userError);
          return;
        }

        if (userData) {
          setUser({
            id: userData.id,
            name: userData.name || userData.full_name || currentSession.user.email?.split('@')[0] || '',
            email: currentSession.user.email!,
            role: userData.role as UserRole,
            avatar: userData.avatar_url,
            phone: userData.phone,
            address: userData.address
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login with Supabase auth
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      setLoading(false);
      return false;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return false;
      }
      
      if (data.user) {
        toast.success(`Welcome back!`);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Failed to login. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
      } else {
        setUser(null);
        toast.info("You have been logged out");
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      setLoading(false);
      return false;
    }
    
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return false;
      }
      
      if (data.user) {
        // Create user profile in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            { 
              id: data.user.id,
              name,
              email,
              role
            }
          ]);
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          toast.error('Account created but profile setup failed. Please contact support.');
          setLoading(false);
          return true; // Still return true as auth account was created
        }
        
        toast.success("Registration successful! You can now log in.");
        setLoading(false);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Failed to register. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
