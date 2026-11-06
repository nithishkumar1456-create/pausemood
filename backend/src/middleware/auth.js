import { supabaseAuthClient, createPerRequestSupabaseClient } from '../config/supabase.js';
import { HttpError } from '../utils/httpError.js';

/**
 * Authentication middleware.
 * Verifies JWT token from Authorization header against Supabase Auth.
 * Attaches user details, token, and a per-request Supabase client to `req`.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Authorization token required'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new HttpError(401, 'Authorization token missing'));
  }

  try {
    // Verify token using Supabase Auth
    const { data: { user }, error } = await supabaseAuthClient.auth.getUser(token);

    if (error || !user) {
      return next(new HttpError(401, 'Invalid or expired authorization token'));
    }

    // Attach authenticated user information and raw token to request
    req.user = user;
    req.token = token;

    // Attach per-request Supabase client initialized with user's JWT
    // This ensures Postgres Row Level Security (RLS) is automatically enforced
    req.supabase = createPerRequestSupabaseClient(token);

    next();
  } catch (err) {
    next(new HttpError(401, 'Authentication failed'));
  }
}

