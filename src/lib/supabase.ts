
import { createClient } from '@supabase/supabase-js';

// Default values for development - REPLACE THESE with your actual Supabase credentials
const DEFAULT_SUPABASE_URL = 'https://your-project-url.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'your-anon-key';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Using default Supabase credentials:', !import.meta.env.VITE_SUPABASE_URL);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
};
