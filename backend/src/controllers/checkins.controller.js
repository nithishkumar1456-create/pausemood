import { HttpError } from '../utils/httpError.js';

/**
 * List all check-ins for the authenticated user, ordered newest first.
 * Defence in depth: Enforces user_id filter in code AND via Supabase RLS.
 */
export async function getCheckins(req, res) {
  const { limit, mood } = req.query;

  let query = req.supabase
    .from('checkins')
    .select('id, mood, note, tag, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(limit || 50);

  if (mood) {
    query = query.eq('mood', mood);
  }

  const { data, error } = await query;

  if (error) {
    throw new HttpError(500, error.message);
  }

  res.status(200).json(data || []);
}

/**
 * Create a new mood check-in for the authenticated user.
 */
export async function createCheckin(req, res) {
  const { mood, note, tag } = req.body;

  const insertData = {
    user_id: req.user.id,
    mood,
    note: note ?? null,
    tag: tag ?? null,
  };

  const { data, error } = await req.supabase
    .from('checkins')
    .insert([insertData])
    .select('id, mood, note, tag, created_at')
    .single();

  if (error) {
    throw new HttpError(500, error.message);
  }

  res.status(201).json(data);
}

/**
 * Update an existing check-in (e.g. tag).
 * Returns 404 if check-in doesn't exist or doesn't belong to the user.
 */
export async function updateCheckin(req, res) {
  const { id } = req.params;
  const { tag } = req.body;

  const updateData = {};
  if (tag !== undefined) {
    updateData.tag = tag;
  }

  const { data, error } = await req.supabase
    .from('checkins')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select('id, mood, note, tag, created_at')
    .maybeSingle();

  if (error) {
    throw new HttpError(500, error.message);
  }

  if (!data) {
    throw new HttpError(404, 'Check-in not found');
  }

  res.status(200).json(data);
}

/**
 * Delete a check-in by ID.
 * Returns 204 on success.
 * Returns 404 if the check-in is not found or is owned by another user.
 */
export async function deleteCheckin(req, res) {
  const { id } = req.params;

  // Perform delete ensuring both ID and user_id match
  const { data, error } = await req.supabase
    .from('checkins')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select('id');

  if (error) {
    throw new HttpError(500, error.message);
  }

  // If no row was matched and deleted, return 404
  if (!data || data.length === 0) {
    throw new HttpError(404, 'Check-in not found');
  }

  res.status(204).send();
}

