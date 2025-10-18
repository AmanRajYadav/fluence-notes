-- Create table
create extension if not exists pgcrypto;

create table if not exists notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  title text,
  content text,
  pinned boolean default false,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS and policies
alter table notes enable row level security;

-- Allow users to see their own notes OR public notes from anyone
create policy "Allow logged in select" on notes
  for select using (
    auth.role() = 'authenticated' and
    (user_id = auth.uid() or is_public = true)
  );

create policy "Allow insert for owner" on notes
  for insert with check (auth.role() = 'authenticated' and user_id = auth.uid());

create policy "Allow update for owner" on notes
  for update using (auth.role() = 'authenticated' and user_id = auth.uid());

create policy "Allow delete for owner" on notes
  for delete using (auth.role() = 'authenticated' and user_id = auth.uid());
