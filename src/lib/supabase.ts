
import { createClient } from '@supabase/supabase-js';

// Use Supabase URL and anon key from the integration
const supabaseUrl = "https://rjjwgsvbjjtflyziohnn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqandnc3Ziamp0Zmx5emlvaG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NjQ5MjcsImV4cCI6MjA2MjQ0MDkyN30.AkaZJCZD9UTDYikqWKMDaLngR2Mb1ceRMXn0dv3PYUA";

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
