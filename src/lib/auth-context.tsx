
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
          await fetchAndSetUserData(session.user.id);
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
        await fetchAndSetUserData(currentSession.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to fetch user data
  const fetchAndSetUserData = async (userId: string) => {
    try {
      // First check if the user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        // Try to get auth user data as fallback
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          // Create missing user record
          await createUserRecord(authUser);
          return;
        }
        return;
      }

      if (userData) {
        // Get email from auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        setUser({
          id: userData.id,
          name: userData.name || '',
          email: authUser?.email || '',
          role: userData.role as UserRole,
          avatar: userData.avatar_url,
          phone: userData.phone,
          address: userData.address
        });
      }
    } catch (err) {
      console.error('Error fetching and setting user data:', err);
    }
  };

  // Helper function to create user record if missing
  const createUserRecord = async (authUser: any) => {
    if (!authUser) return;
    
    try {
      const userMetadata = authUser.user_metadata || {};
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          { 
            id: authUser.id,
            name: userMetadata.name || authUser.email?.split('@')[0] || '',
            email: authUser.email,
            role: userMetadata.role || 'student'
          }
        ]);
      
      if (error) {
        console.error('Error creating user record:', error);
        return;
      }
      
      // Fetch the user data again to update the state
      await fetchAndSetUserData(authUser.id);
      
    } catch (err) {
      console.error('Error creating user record:', err);
    }
  };

  // Login with Supabase auth
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured. Set environment variables.');
      setLoading(false);
      return false;
    }
    
    try {
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error('Login failed: ' + error.message);
        setLoading(false);
        return false;
      }
      
      if (data.user) {
        // Check if user exists in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        
        // If user doesn't exist in the users table, create the record
        if (!userData || userError) {
          await createUserRecord(data.user);
        }
        
        // Fetch user data to set state
        await fetchAndSetUserData(data.user.id);
        
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
      toast.error('Supabase is not configured. Set environment variables.');
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
      toast.error('Supabase is not configured. Set environment variables.');
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
          toast.error('Account created but profile setup failed. Please try logging in.');
        } else {
          toast.success("Registration successful! You can now log in.");
        }
        
        // Sign out after registration so they can log in properly
        await supabase.auth.signOut();
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
      // Use the database function to create an admin if none exists
      await supabase.rpc('create_admin_if_not_exists');
      console.log('Admin user check completed');
    } catch (err) {
      console.error('Admin creation check error:', err);
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
