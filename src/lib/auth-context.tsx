import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, UserRole } from "./types";
import { toast } from "@/components/ui/sonner";
import { supabase, isSupabaseConfigured } from "./supabase";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    let isMounted = true;
    console.log('[AuthContext] useEffect for session check mounted. Initial loading state for this effect cycle:', loading);

    const performCheckSession = async () => {
      if (!isMounted) return;
      
      // Explicitly set loading to true at the beginning of the check
      // This ensures that if AuthProvider re-renders, `loading` is true during check.
      console.log('[AuthContext] performCheckSession started. Setting loading: true');
      setLoading(true); 

      try {
        if (!isSupabaseConfigured()) {
          console.warn('[AuthContext] Supabase is not properly configured in performCheckSession.');
          if (isMounted) {
            setIsConfigured(false);
            setUser(null);
          }
          return;
        }
        if (isMounted) {
          setIsConfigured(true);
        }
        
        console.log('[AuthContext] Checking Supabase session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthContext] Error getting session:', error);
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        if (session) {
          console.log('[AuthContext] Session found. Fetching user data for user ID:', session.user.id);
          if (isMounted) {
            await fetchAndSetUserData(session.user.id);
          }
        } else {
          console.log('[AuthContext] No active session found.');
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Error during performCheckSession:', err);
        if (isMounted) {
          setUser(null); // Ensure user is null on any unexpected error
        }
      } finally {
        if (isMounted) {
          console.log('[AuthContext] performCheckSession finished. Setting loading: false');
          setLoading(false);
        }
      }
    };

    performCheckSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;
        console.log('[AuthContext] onAuthStateChange triggered. Event:', event, 'Session:', currentSession ? 'Exists' : 'Null');
        
        // This callback primarily updates the user state based on auth events.
        // It should not manage the main `loading` state tied to initial load or explicit auth ops.
        if (currentSession) {
          await fetchAndSetUserData(currentSession.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      console.log('[AuthContext] useEffect for session check unmounted. Subscription cancelled.');
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount.

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
        } else {
          // Fetch user data to set state
          await fetchAndSetUserData(data.user.id);
        }
        
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register, 
      isConfigured
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
