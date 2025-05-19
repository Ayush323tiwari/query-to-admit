
import { supabase } from '../supabase';
import { User } from '../types';

// User related API calls
export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  // Prepare updates object for Supabase table format
  const supabaseUpdates: Record<string, any> = {};
  
  // Map User object properties to table column names
  if (updates.name) supabaseUpdates.name = updates.name;
  if (updates.phone) supabaseUpdates.phone = updates.phone;
  if (updates.address) supabaseUpdates.address = updates.address;
  if (updates.avatar) supabaseUpdates.avatar_url = updates.avatar;
  
  const { data, error } = await supabase
    .from('users')
    .update(supabaseUpdates)
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data[0];
};
