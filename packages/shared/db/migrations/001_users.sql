-- Migration: 001_users
-- Creates the core users and profiles tables.
-- Run with: supabase db push  OR  psql -f migrations/001_users.sql

-- ─── Extensions ───────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ─── Users ────────────────────────────────────────────────────────────────────

create table if not exists users (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null unique,
  role        text not null default 'user' check (role in ('admin', 'user')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Profiles ─────────────────────────────────────────────────────────────────

create table if not exists profiles (
  id            uuid primary key references users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on users
  for each row execute function set_updated_at();

create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ─── RLS ──────────────────────────────────────────────────────────────────────

alter table users    enable row level security;
alter table profiles enable row level security;

-- Admins can read all users; users can only read themselves
create policy "users_select" on users
  for select using (
    auth.uid() = id
    or exists (
      select 1 from users u where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Users can read/update their own profile
create policy "profiles_select" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update" on profiles
  for update using (auth.uid() = id);
