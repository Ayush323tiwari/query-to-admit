
import { supabase } from '../supabase';
import { Course } from '../types';

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
