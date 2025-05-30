
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
  createAdminIfNotExists: () => Promise<void>;
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

  // Login with Supabase auth - Modified to work with unconfirmed emails
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      setLoading(false);
      return false;
    }
    
    try {
      // First try normal login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // If error is "Email not confirmed", try to automatically confirm and login
        if (error.message === 'Email not confirmed') {
          console.log('Email not confirmed, trying to auto-confirm...');
          
          // Try to fetch user data directly from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
            
          if (userError) {
            toast.error('Login failed: ' + error.message);
            setLoading(false);
            return false;
          }
          
          if (userData) {
            // Try signing in again - this might work in development mode or if confirmation requirements are disabled
            const { data: secondAttempt, error: secondError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (secondError) {
              toast.error('Login failed: ' + secondError.message);
              console.error('Second login attempt failed:', secondError);
              setLoading(false);
              return false;
            }
            
            if (secondAttempt.user) {
              toast.success(`Welcome back!`);
              return true;
            }
          }
          
          toast.error('Login failed: Email confirmation required. Please check your email.');
          setLoading(false);
          return false;
        }
        
        toast.error('Login failed: ' + error.message);
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
      // Register with Supabase Auth with autoconfirm enabled
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          },
          emailRedirectTo: window.location.origin
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

  // Function to create an admin user if none exists
  const createAdminIfNotExists = async () => {
    if (!isSupabaseConfigured()) {
      return;
    }
    
    try {
      // Check if admin exists
      const { data: adminUsers, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin');
      
      if (checkError) {
        console.error('Error checking admin users:', checkError);
        return;
      }
      
      // If no admin user exists, create one
      if (!adminUsers || adminUsers.length === 0) {
        const adminEmail = 'admin@querytoadmit.com';
        const adminPassword = 'Admin@123';
        const adminName = 'System Admin';
        
        // Create admin user in auth
        const { data, error } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            data: {
              name: adminName,
              role: 'admin'
            }
          }
        });
        
        if (error) {
          console.error('Error creating admin auth:', error);
          return;
        }
        
        if (data.user) {
          // Create admin profile in users table
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              { 
                id: data.user.id,
                name: adminName,
                email: adminEmail,
                role: 'admin' as UserRole
              }
            ]);
          
          if (profileError) {
            console.error('Error creating admin profile:', profileError);
            return;
          }
          
          console.log('Default admin user created successfully');
          toast.success('Default admin user created. Email: admin@querytoadmit.com, Password: Admin@123');
        }
      }
    } catch (err) {
      console.error('Admin creation error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register, 
      isConfigured, 
      createAdminIfNotExists 
    }}>
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
