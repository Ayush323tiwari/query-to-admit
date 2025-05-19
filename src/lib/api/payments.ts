
import { supabase } from '../supabase';
import { Payment } from '../types';

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
