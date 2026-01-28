-- CODM HUB Supabase Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: Streamers
create table streamers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  avatar_url text,
  video_url text,
  bio text,
  tags text[], -- Array of tags
  platforms jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Weapons
create table weapons (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  category text not null, -- AR, SMG, etc.
  image_url text,
  videos jsonb default '[]'::jsonb, -- Array of video objects
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Loadouts
create table loadouts (
  id uuid primary key default uuid_generate_v4(),
  streamer_id uuid references streamers(id) on delete cascade not null,
  weapon_id uuid references weapons(id) on delete cascade not null,
  code text not null,
  attachments jsonb default '{}'::jsonb,
  perks jsonb default '{}'::jsonb,
  equipment jsonb default '{}'::jsonb,
  notes text,
  stats jsonb default '{"views": 0, "copies": 0}'::jsonb,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Settings (Global App Config)
create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Users (Admin reference)
-- Note: Real auth will use auth.users, but we can have an app-level user table if needed
create table app_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  role text default 'USER',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Basic Public Read)
alter table streamers enable row level security;
alter table weapons enable row level security;
alter table loadouts enable row level security;

create policy "Public read streamers" on streamers for select using (true);
create policy "Public read weapons" on weapons for select using (true);
create policy "Public read loadouts" on loadouts for select using (true);

-- Admin Write Policies (Secured)
-- 1. Streamers: Only Admins can modify
create policy "Admin write streamers" on streamers for all
using (
  auth.role() = 'authenticated' and
  exists (
    select 1 from app_users
    where app_users.id = auth.uid() and app_users.role = 'ADMIN'
  )
);

-- 2. Weapons: Only Admins can modify
create policy "Admin write weapons" on weapons for all
using (
  auth.role() = 'authenticated' and
  exists (
    select 1 from app_users
    where app_users.id = auth.uid() and app_users.role = 'ADMIN'
  )
);

-- 3. Loadouts: Only Admins can modify (or user who owns it - future feature)
create policy "Admin write loadouts" on loadouts for all
using (
  auth.role() = 'authenticated' and
  exists (
    select 1 from app_users
    where app_users.id = auth.uid() and app_users.role = 'ADMIN'
  )
);
