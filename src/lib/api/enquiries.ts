
import { supabase } from '../supabase';
import { Enquiry, EnquiryStatus } from '../types';

// Enquiry related API calls
export const fetchEnquiries = async (userId?: string, role?: string) => {
  let query = supabase.from('enquiries').select('*');
  
  // If student role, only show their enquiries
  if (role === 'student' && userId) {
    query = query.eq('user_id', userId);
  }
  
  // Order by created date
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching enquiries:", error);
    throw error;
  }
  return data;
};

export const createEnquiry = async (enquiry: Partial<Enquiry>) => {
  // Map our Enquiry type to the Supabase table structure
  const supabaseEnquiry = {
    user_id: enquiry.studentId,
    name: enquiry.studentName,
    email: enquiry.email,
    phone: enquiry.contact,
    subject: enquiry.course,
    message: enquiry.message,
    status: enquiry.status || 'new'
  };

  const { data, error } = await supabase
    .from('enquiries')
    .insert([supabaseEnquiry])
    .select();

  if (error) throw error;
  
  // Format the returned data to match our app's Enquiry type
  return {
    id: data[0].id,
    studentId: data[0].user_id,
    studentName: data[0].name,
    email: data[0].email,
    contact: data[0].phone,
    course: data[0].subject,
    message: data[0].message,
    status: data[0].status as EnquiryStatus,
    createdAt: data[0].created_at
  } as Enquiry;
};

export const updateEnquiry = async (id: string, updates: Partial<Enquiry>) => {
  // Map our Enquiry type updates to Supabase table structure
  const supabaseUpdates: Record<string, any> = {};
  
  if (updates.status) supabaseUpdates.status = updates.status;
  if (updates.message) supabaseUpdates.message = updates.message;

  const { data, error } = await supabase
    .from('enquiries')
    .update(supabaseUpdates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};
