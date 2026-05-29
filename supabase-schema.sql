-- ============================================
-- Y Style Lounge — Supabase Database Schema
-- Run this in Supabase → SQL Editor
-- ============================================

-- Bookings table
create table if not exists bookings (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  date          date not null,
  time_slot     text not null,
  service       text not null,
  client_name   text not null,
  client_phone  text not null,
  client_email  text,
  notes         text,
  status        text default 'confirmed' check (status in ('confirmed','completed','cancelled')),
  user_id       uuid references auth.users(id) on delete set null
);

-- Index for fast date queries
create index if not exists bookings_date_idx on bookings(date);
create index if not exists bookings_email_idx on bookings(client_email);

-- Row Level Security
alter table bookings enable row level security;

-- Public can INSERT (new bookings without login)
create policy "Anyone can book" on bookings
  for insert with check (true);

-- Logged-in users can read their own bookings
create policy "Users see own bookings" on bookings
  for select using (
    auth.uid() = user_id
    or client_email = (select email from auth.users where id = auth.uid())
  );

-- Admins can do everything (set role = 'admin' in user metadata)
create policy "Admin full access" on bookings
  for all using (
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'admin'
  );

-- ============================================
-- HOW TO CREATE ADMIN USER:
-- 1. Register normally via the site
-- 2. Go to Supabase Dashboard → Authentication → Users
-- 3. Click the user → Edit → User Metadata → add: {"role": "admin"}
-- ============================================
