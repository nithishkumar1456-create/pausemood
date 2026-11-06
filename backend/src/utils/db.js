import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

/**
 * Updates a user's password directly in auth.users using Postgres crypt()
 */
export async function updateUserPasswordInDb(email, newPassword) {
  if (!connectionString) {
    console.warn('[DB] No DATABASE_URL configured');
    return false;
  }

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const res = await client.query(
      `UPDATE auth.users
       SET encrypted_password = crypt($1, gen_salt('bf')),
           updated_at = NOW()
       WHERE LOWER(email) = LOWER($2)
       RETURNING id, email`,
      [newPassword, email.trim().toLowerCase()]
    );
    return res.rowCount > 0;
  } catch (err) {
    console.error('[DB] Failed to update password:', err);
    throw err;
  } finally {
    try {
      await client.end();
    } catch {}
  }
}

