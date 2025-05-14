import { supabase } from './supabase';
import { Enquiry, Enrollment, Payment, Course, User, EnquiryStatus, UserRole } from './types';
import { toast } from '@/hooks/use-toast';

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

// Enrollment related API calls
export const fetchEnrollments = async (userId?: string, role?: string) => {
  // Join enrollments with courses to get course names
  let query = supabase
    .from('enrollments')
    .select(`
      *,
      courses:course_id (name)
    `);
  
  // If student role, only show their enrollments
  if (role === 'student' && userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  // Format the data to match our Enrollment type
  return data;
};

export const createEnrollment = async (enrollment: Partial<Enrollment>) => {
  // Map our Enrollment type to Supabase table structure
  const supabaseEnrollment = {
    user_id: enrollment.studentId,
    course_id: enrollment.course, // Changed from courseId to course to match the type
    enrollment_date: new Date().toISOString(),
    status: 'submitted'
  };

  const { data, error } = await supabase
    .from('enrollments')
    .insert([supabaseEnrollment])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateEnrollment = async (id: string, updates: Partial<Enrollment>) => {
  // Map our Enrollment type updates to Supabase table structure
  const supabaseUpdates: Record<string, any> = {};
  
  if (updates.status) supabaseUpdates.status = updates.status;
  // Add other fields as needed

  const { data, error } = await supabase
    .from('enrollments')
    .update(supabaseUpdates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Payment related API calls
export const fetchPayments = async (userId?: string, role?: string) => {
  let query = supabase.from('payments').select('*');
  
  // If student role, only show their payments
  if (role === 'student' && userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  // Format the data to match our Payment type
  return data.map(payment => ({
    id: payment.id,
    studentId: payment.user_id,
    studentName: '', // Need to fetch from users table separately if needed
    enrollmentId: payment.enrollment_id,
    amount: payment.amount,
    method: payment.payment_method,
    status: payment.status,
    createdAt: payment.created_at,
    updatedAt: payment.updated_at,
    receiptUrl: payment.transaction_id // Using transaction_id field for receipt URL
  }));
};

export const createPayment = async (payment: Partial<Payment>) => {
  // Map our Payment type to Supabase table structure
  const supabasePayment = {
    user_id: payment.studentId,
    enrollment_id: payment.enrollmentId,
    amount: payment.amount,
    payment_method: payment.method,
    status: 'pending',
    transaction_id: payment.receiptUrl || null
  };

  const { data, error } = await supabase
    .from('payments')
    .insert([supabasePayment])
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
  
  // Format the data to match our Course type
  return data.map(course => ({
    id: course.id,
    name: course.name,
    shortDescription: course.description || '',
    duration: course.duration,
    fee: course.fees
  }));
};

// Admin API calls
export const fetchAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data[0];
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
