import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Ensures the client checks the URL for auth tokens on init
    detectSessionInUrl: true,
    // Use localStorage for session persistence in the browser
    persistSession: true,
    // Auto-refresh the session token before it expires
    autoRefreshToken: true,
  },
});
