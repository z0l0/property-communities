import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txjmdjfahrumhgayqurm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4am1kamZhaHJ1bWhnYXlxdXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNzk0OTcsImV4cCI6MjA0NTY1NTQ5N30.PINsZyLwMIwm-85vsc3lYEhrEDtOLNB67pqHl1VEqZU'; // This is a public key, not a secret

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Community = {
  id: string;
  name: string;
  platform: 'facebook' | 'reddit';
  url: string;
  city: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export async function submitCommunity(data: Omit<Community, 'id' | 'created_at' | 'rating' | 'status'>) {
  try {
    const { data: result, error } = await supabase
      .from('communities')
      .insert([{ ...data, status: 'pending', rating: 0 }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    return result;
  } catch (error) {
    console.error('Submission error:', error);
    throw error;
  }
}

export async function getCommunities() {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}