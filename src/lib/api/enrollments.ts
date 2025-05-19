
import { supabase } from '../supabase';
import { Enrollment } from '../types';

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
    course_id: enrollment.course, // Using course instead of courseId to match the Enrollment type
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
