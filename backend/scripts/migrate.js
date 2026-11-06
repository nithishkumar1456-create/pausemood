import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:Ih9oUeap5FVMT8RM@db.jxvefzwdwzfbjfvytcll.supabase.co:5432/postgres';

const { Client } = pg;

async function migrate() {
  console.log('[Migrate] Connecting to Supabase Postgres database...');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('[Migrate] Connected successfully to Postgres!');

  const schemaPath = path.join(__dirname, '../supabase/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('[Migrate] Running schema.sql...');
  await client.query(sql);

  console.log('[Migrate] Schema successfully applied!');

  // Verify the checkins table exists
  const checkRes = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'checkins';
  `);

  if (checkRes.rows.length > 0) {
    console.log('[Migrate] Verified: public.checkins table exists.');
  } else {
    console.warn('[Migrate] Warning: public.checkins table was not found.');
  }

  await client.end();
}

migrate().catch((err) => {
  console.error('[Migrate Error]', err);
  process.exit(1);
});

