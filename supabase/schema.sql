-- ============================================
-- HARRYS PICKS — SUPABASE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PROFILES (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('admin', 'client', 'salesperson')),
  created_at timestamptz default now()
);

-- 2. SALESPEOPLE
create table if not exists salespeople (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  venmo_handle text,
  created_at timestamptz default now()
);

-- 3. CLIENTS
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  full_name text,
  phone text,
  status text not null default 'lead' check (status in ('active', 'inactive', 'lead')),
  salesperson_id uuid references salespeople(id) on delete set null,
  notes text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- 4. PACKAGES
create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  sport text not null check (sport in ('football', 'basketball', 'baseball', 'horse_racing', 'all')),
  name text not null,
  description text,
  price numeric(10,2) not null,
  duration_days integer,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 5. SUBSCRIPTIONS
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  package_id uuid references packages(id),
  start_date date not null default current_date,
  end_date date,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  payment_method text default 'venmo',
  payment_ref text,
  amount_paid numeric(10,2),
  created_at timestamptz default now()
);

-- 6. PICKS
create table if not exists picks (
  id uuid primary key default gen_random_uuid(),
  sport text not null check (sport in ('football', 'basketball', 'baseball', 'horse_racing')),
  title text not null,
  description text,
  level text default '4',
  result text check (result in ('win', 'loss', 'push', null)),
  is_public boolean default true,
  published_at timestamptz default now(),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 7. LEADS (email capture from homepage)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  phone text,
  source text default 'homepage',
  created_at timestamptz default now()
);

-- 8. HORSE RACING PICKS (for learning agent)
create table if not exists horse_racing_picks (
  id uuid primary key default gen_random_uuid(),
  race_date date not null,
  track text not null,
  race_number integer not null,
  horse_name text not null,
  program_number integer not null,
  predicted_score integer,
  predicted_rank integer,
  actual_finish integer,
  ml_odds text,
  predicted_factors text[],
  score_breakdown integer[],
  result text check (result in ('win', 'placed', 'show', 'lost', 'pending')),
  recorded_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique(race_date, track, race_number, program_number)
);

alter table horse_racing_picks enable row level security;

create policy "Admins manage horse racing picks" on horse_racing_picks for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Auth users read horse picks" on horse_racing_picks for select using (
  auth.role() = 'authenticated'
);


  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  phone text,
  source text default 'homepage',
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table profiles enable row level security;
alter table clients enable row level security;
alter table salespeople enable row level security;
alter table packages enable row level security;
alter table subscriptions enable row level security;
alter table picks enable row level security;
alter table leads enable row level security;

-- PROFILES policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- CLIENTS policies
create policy "Admins full access to clients" on clients for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Salespeople see own clients" on clients for select using (
  exists (
    select 1 from salespeople sp
    where sp.user_id = auth.uid()
    and sp.id = clients.salesperson_id
  )
);
create policy "Salespeople update own clients" on clients for update using (
  exists (
    select 1 from salespeople sp
    where sp.user_id = auth.uid()
    and sp.id = clients.salesperson_id
  )
);
create policy "Clients view own record" on clients for select using (user_id = auth.uid());

-- PICKS policies
create policy "Anyone can read public picks" on picks for select using (is_public = true);
create policy "Admins can manage picks" on picks for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- PACKAGES policies
create policy "Anyone can view active packages" on packages for select using (is_active = true);
create policy "Admins can manage packages" on packages for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- SUBSCRIPTIONS policies
create policy "Clients view own subscriptions" on subscriptions for select using (
  exists (select 1 from clients where clients.id = subscriptions.client_id and clients.user_id = auth.uid())
);
create policy "Admins manage subscriptions" on subscriptions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- LEADS policies (only service role / admin can access)
create policy "Admins view leads" on leads for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- SALESPEOPLE policies
create policy "Admins manage salespeople" on salespeople for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Salespeople view own record" on salespeople for select using (user_id = auth.uid());

-- ============================================
-- SEED DATA — Default packages
-- ============================================

insert into packages (sport, name, description, price, duration_days) values
  ('football', '🏈 Football Package 4', 'All Code 5, Super Sonic, Mama Jama Locks, Level 4 and Special plays through Monday', 225, 7),
  ('football', '🏈 Daily Full Package', 'Super Sonic, Mama Jama Locks, Level 4, and all Special plays for the day', 125, 1),
  ('football', '🏈 Super Sonic Play of the Day', 'Our highest-confidence single play of the day', 55, 1),
  ('football', '🏈 Level 4 Plays of the Day', 'Level 4 rated selections daily', 40, 1),
  ('football', '🏈 Level 3 Play Daily', 'Daily Level 3 entry-level play', 20, 1),
  ('football', '🏈 Super Bowl Special', 'Special Super Bowl pick package', 25, 1),
  ('basketball', '🏀 NCAAB Super Sonic Play', 'Highest-confidence College Basketball play of the day', 55, 1),
  ('basketball', '🏀 NCAAB Level 4 Plays Daily', 'Daily Level 4 rated NCAAB selections', 40, 1),
  ('basketball', '🏀 Saturday 4 Play NCAAB Special', 'Four expertly selected NCAAB plays every Saturday', 20, 1),
  ('basketball', '🏀 Early Bird College Basketball Tournaments', 'Full tournament package — March Madness and conference tournaments', 295, null),
  ('baseball', '⚾ Baseball Season Membership', 'Every MLB pick from Opening Day through the World Series', 2500, null),
  ('baseball', '⚾ Monthly Baseball Membership', 'Full month of MLB picks', 450, 30),
  ('baseball', '⚾ Baseball Special', 'Weekly MLB special package', 175, 7),
  ('baseball', '⚾ 1 Week Baseball Membership', 'One full week of baseball picks', 125, 7),
  ('baseball', '⚾ 1 High Octane Play', 'Single highest-confidence MLB play', 100, 1),
  ('horse_racing', '🐎 Daily Horse Racing', 'Full card analysis — Churchill, Keeneland, and all major tracks', 75, 1),
  ('horse_racing', '🐎 Weekend Special', 'Friday through Sunday racing action', 175, 3),
  ('horse_racing', '🐎 Full Month — Unlimited Racing', '30 days of unlimited racing picks from all major tracks', 450, 30)
on conflict do nothing;
