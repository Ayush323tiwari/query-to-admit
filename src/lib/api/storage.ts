
import { supabase } from '../supabase';

// Storage operations
export const uploadDocument = async (file: File, path: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${path}/${Date.now()}.${fileExt}`;
  
  const { error, data } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);
    
  return publicUrl;
};

export const deleteDocument = async (path: string) => {
  const { error } = await supabase.storage
    .from('documents')
    .remove([path]);

  if (error) throw error;
  return true;
};
