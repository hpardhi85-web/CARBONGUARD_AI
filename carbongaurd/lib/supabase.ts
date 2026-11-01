import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://osugressdalwirfqknco.supabase.co';
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || '';

export const supabase = createSupabaseClient(supabaseUrl, supabasePublishableKey);

export function getAdminClient() {
  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}
