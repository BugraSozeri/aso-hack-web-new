-- ASOHack Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enum types
create type plan_type as enum ('free', 'starter', 'pro');
create type store_type as enum ('apple', 'google');
create type app_role as enum ('own', 'competitor');

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  avatar_url text,
  plan plan_type default 'free' not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text,
  current_period_end timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Usage logs for rate limiting
create table public.usage_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  tool_name text not null,
  created_at timestamptz default now() not null
);

-- Saved ASO audit reports
create table public.saved_audits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  app_id text not null,
  store store_type not null,
  app_name text not null,
  audit_data jsonb not null,
  score integer not null check (score >= 0 and score <= 100),
  created_at timestamptz default now() not null
);

-- Tracked apps (for competitor tracker)
create table public.tracked_apps (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  app_id text not null,
  store store_type not null,
  app_name text not null,
  role app_role not null,
  created_at timestamptz default now() not null,
  unique(user_id, app_id, store)
);

-- Daily app snapshots
create table public.app_snapshots (
  id uuid primary key default uuid_generate_v4(),
  tracked_app_id uuid references public.tracked_apps(id) on delete cascade not null,
  date date not null,
  rating numeric(3,2),
  review_count integer,
  rank_data jsonb,
  created_at timestamptz default now() not null,
  unique(tracked_app_id, date)
);

-- Newsletter subscribers
create table public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  confirmed boolean default false not null,
  created_at timestamptz default now() not null
);

-- Indexes for performance
create index idx_usage_logs_user_tool on public.usage_logs(user_id, tool_name, created_at);
create index idx_saved_audits_user on public.saved_audits(user_id, created_at desc);
create index idx_tracked_apps_user on public.tracked_apps(user_id);
create index idx_app_snapshots_app_date on public.app_snapshots(tracked_app_id, date desc);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.usage_logs enable row level security;
alter table public.saved_audits enable row level security;
alter table public.tracked_apps enable row level security;
alter table public.app_snapshots enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- RLS Policies: users can only access their own data
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can view own usage"
  on public.usage_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.usage_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can view own audits"
  on public.saved_audits for select
  using (auth.uid() = user_id);

create policy "Users can insert own audits"
  on public.saved_audits for insert
  with check (auth.uid() = user_id);

create policy "Users can view own tracked apps"
  on public.tracked_apps for select
  using (auth.uid() = user_id);

create policy "Users can manage own tracked apps"
  on public.tracked_apps for all
  using (auth.uid() = user_id);

create policy "Users can view own snapshots"
  on public.app_snapshots for select
  using (
    tracked_app_id in (
      select id from public.tracked_apps where user_id = auth.uid()
    )
  );

-- Newsletter: anyone can subscribe (insert), admin reads via service role
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on public.users
  for each row execute function public.handle_updated_at();
