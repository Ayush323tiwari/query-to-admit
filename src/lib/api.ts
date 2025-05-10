
import { supabase } from './supabase';
import { Enquiry, Enrollment, Payment, Course, User, EnquiryStatus } from './types';

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
    .eq('id', userId);

  if (error) throw error;
  return data;
};

// Enquiry related API calls
export const fetchEnquiries = async (userId?: string, role?: string) => {
  let query = supabase.from('enquiries').select('*');
  
  // If student role, only show their enquiries
  if (role === 'student' && userId) {
    query = query.eq('studentId', userId);
  }
  
  // Order by created date
  query = query.order('createdAt', { ascending: false });
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createEnquiry = async (enquiry: Partial<Enquiry>) => {
  const { data, error } = await supabase
    .from('enquiries')
    .insert([enquiry])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateEnquiry = async (id: string, updates: Partial<Enquiry>) => {
  const { data, error } = await supabase
    .from('enquiries')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return data;
};

// Enrollment related API calls
export const fetchEnrollments = async (userId?: string, role?: string) => {
  let query = supabase.from('enrollments').select('*');
  
  // If student role, only show their enrollments
  if (role === 'student' && userId) {
    query = query.eq('studentId', userId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createEnrollment = async (enrollment: Partial<Enrollment>) => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert([enrollment])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateEnrollment = async (id: string, updates: Partial<Enrollment>) => {
  const { data, error } = await supabase
    .from('enrollments')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return data;
};

// Payment related API calls
export const fetchPayments = async (userId?: string, role?: string) => {
  let query = supabase.from('payments').select('*');
  
  // If student role, only show their payments
  if (role === 'student' && userId) {
    query = query.eq('studentId', userId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createPayment = async (payment: Partial<Payment>) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select();

  if (error) throw error;
  return data[0];
};

// Course related API calls
export const fetchCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*');

  if (error) throw error;
  return data;
};

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
