/**
 * Supabase Client Configuration
 * 
 * Two clients:
 *   - supabase:      Uses anon key, respects RLS policies (user-context operations)
 *   - supabaseAdmin: Uses service role key, bypasses RLS (admin/system operations)
 */

const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

/**
 * Public client — respects Row Level Security.
 * Use for user-facing operations where RLS should enforce access control.
 */
const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

/**
 * Admin client — bypasses Row Level Security.
 * Use ONLY for server-side operations that require full database access
 * (e.g., creating users, running cron jobs, admin queries).
 */
const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

module.exports = { supabase, supabaseAdmin };
