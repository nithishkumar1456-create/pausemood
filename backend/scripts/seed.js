import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY } = process.env;

if (!SUPABASE_URL || (!SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_ANON_KEY)) {
  console.error('[Seed Error] Missing Supabase URL or keys in environment variables.');
  process.exit(1);
}

// Client for user authentication
const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function seed() {
  console.log('[Seed] Seeding 7 demo check-ins into Supabase...');

  const demoEmail = 'demo.pausemood@gmail.com';
  const demoPassword = 'DemoPassword123!';
  const demoName = 'Demo User';

  let userId;
  let token;

  // Try signing up demo user
  const { data: signUpData, error: signUpError } = await authClient.auth.signUp({
    email: demoEmail,
    password: demoPassword,
    options: { data: { name: demoName } },
  });

  if (signUpData?.user && signUpData?.session) {
    userId = signUpData.user.id;
    token = signUpData.session.access_token;
  } else {
    // If already signed up or no session from signup, sign in with password
    const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (signInError || !signInData.session) {
      console.error('[Seed Error] Could not authenticate demo user:', signInError?.message);
      process.exit(1);
    }
    userId = signInData.user.id;
    token = signInData.session.access_token;
  }

  console.log(`[Seed] Authenticated demo user: ${demoEmail} (ID: ${userId})`);

  // Create an authenticated client with user's JWT so RLS allows data access
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Clear existing demo check-ins for clean seeding
  await userClient.from('checkins').delete().eq('user_id', userId);

  // 7 demo entries covering the last 7 days
  const demoCheckins = [
    { mood: 1, note: 'A tough day...', tag: 'Rest', daysAgo: 6 },
    { mood: 3, note: 'A calm day.', tag: null, daysAgo: 5 },
    { mood: 2, note: 'Feeling a bit tired.', tag: 'Sleep', daysAgo: 4 },
    { mood: 4, note: 'Finished my project.', tag: 'Work done', daysAgo: 3 },
    { mood: 5, note: 'Had a productive day!', tag: 'Friends', daysAgo: 2 },
    { mood: 3, note: 'Just an average Tuesday.', tag: 'Music', daysAgo: 1 },
    { mood: 4, note: 'Went for a nice walk.', tag: 'Walk', daysAgo: 0 },
  ];

  const rows = demoCheckins.map((item) => {
    const date = new Date();
    date.setDate(date.getDate() - item.daysAgo);
    return {
      user_id: userId,
      mood: item.mood,
      note: item.note,
      tag: item.tag,
      created_at: date.toISOString(),
    };
  });

  const { error: insertError } = await userClient.from('checkins').insert(rows);

  if (insertError) {
    console.error('[Seed Error] Failed to insert demo check-ins:', insertError.message);
    process.exit(1);
  }

  console.log('\x1b[32m[Seed Success] Successfully inserted 7 demo check-ins into Supabase!\x1b[0m');
  console.log('You can log in to the frontend app using:');
  console.log(`  Email:    ${demoEmail}`);
  console.log(`  Password: ${demoPassword}`);
}

seed().catch((err) => {
  console.error('[Seed Exception]', err);
  process.exit(1);
});
