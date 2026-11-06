-- PauseMood Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Create the checkins table
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood smallint not null check (mood between 1 and 5),
  note text check (note is null or char_length(note) <= 200),
  tag text check (tag is null or char_length(tag) <= 40),
  created_at timestamptz not null default now()
);

-- 2. Index for fast user-specific newest-first queries
create index if not exists checkins_user_created_idx on public.checkins (user_id, created_at desc);

-- 3. Enable Row Level Security (RLS)
alter table public.checkins enable row level security;

-- 4. RLS Policies (Users can only SELECT, INSERT, UPDATE, DELETE their own check-ins)
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view their own checkins') then
    create policy "Users can view their own checkins"
      on public.checkins for select using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Users can insert their own checkins') then
    create policy "Users can insert their own checkins"
      on public.checkins for insert with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Users can update their own checkins') then
    create policy "Users can update their own checkins"
      on public.checkins for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Users can delete their own checkins') then
    create policy "Users can delete their own checkins"
      on public.checkins for delete using (auth.uid() = user_id);
  end if;
end $$;

-- 5. Auto-confirm users on signup for development/demo (avoids email rate limits)
create or replace function public.auto_confirm_user()
returns trigger as $$
begin
  new.email_confirmed_at = coalesce(new.email_confirmed_at, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  before insert on auth.users
  for each row
  execute function public.auto_confirm_user();
