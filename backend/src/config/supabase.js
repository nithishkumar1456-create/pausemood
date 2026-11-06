import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Base public client configured with the Supabase Anon Key.
 * Used for authentication operations (signup, login, token verification).
 */
export const supabaseAuthClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Service Role client.
 * NOTE: Holding elevated privileges that bypass Row Level Security.
 * ONLY used for administrative tasks (e.g. system seeds or cleanup), NEVER for normal user check-in queries.
 */
export const supabaseAdmin = env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Factory creating a per-request Supabase client scoped to the authenticated user.
 * Attaches the user's JWT in the Authorization header so Postgres Row Level Security (RLS)
 * is naturally enforced at the database layer (defence-in-depth).
 *
 * @param {string} token - The user's JWT access token
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createPerRequestSupabaseClient(token) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

