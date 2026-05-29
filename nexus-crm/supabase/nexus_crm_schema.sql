-- Nexus CRM Supabase schema
-- Run this in Supabase SQL Editor before enabling VITE_DATA_PROVIDER="supabase".
-- Production note: this schema creates tables and indexes only. Add security policies that match your auth model.

create extension if not exists pgcrypto;

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  company text,
  job_title text,
  industry text,
  notes text,
  status text not null default 'lead',
  owner_uid text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  value numeric not null default 0,
  stage text not null default 'new',
  contact_id text,
  owner_uid text not null,
  created_at timestamptz not null default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  subject text not null,
  description text,
  contact_id text,
  owner_uid text not null,
  timestamp timestamptz not null default now()
);

create table if not exists contents (
  id uuid primary key default gen_random_uuid(),
  prompt text not null,
  result text not null,
  type text not null,
  category text,
  owner_uid text not null,
  created_at timestamptz not null default now()
);

create table if not exists social_accounts (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  name text not null,
  profile_image text,
  owner_uid text not null,
  connected_at timestamptz not null default now()
);

create table if not exists social_posts (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  platforms text[] not null default '{}',
  scheduled_at timestamptz,
  status text not null default 'draft',
  owner_uid text not null,
  created_at timestamptz not null default now()
);

create index if not exists contacts_owner_uid_created_at_idx on contacts(owner_uid, created_at desc);
create index if not exists deals_owner_uid_created_at_idx on deals(owner_uid, created_at desc);
create index if not exists activities_owner_uid_timestamp_idx on activities(owner_uid, timestamp desc);
create index if not exists contents_owner_uid_created_at_idx on contents(owner_uid, created_at desc);
create index if not exists social_accounts_owner_uid_connected_at_idx on social_accounts(owner_uid, connected_at desc);
create index if not exists social_posts_owner_uid_created_at_idx on social_posts(owner_uid, created_at desc);
