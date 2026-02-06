-- Enable Supabase Vault for encryption
create extension if not exists "supabase_vault" with schema "vault";

-- Create specific Key ID (optional, usually Vault manages this, but for explicit PII we might want a named key if using direct pgsodium, but Vault is easier)
-- Note: Supabase Vault creates keys automatically or you can add secrets. 
-- For this simple PII, we will assume transparent column encryption or just storing basic data for now, 
-- but let's set up the 'applications' table with RLS.

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id),
  full_name text,
  email text,
  portfolio_url text,
  status text default 'pending', -- pending, approved, rejected
  -- For strict PII, you would use separate Vault secrets or pgsodium, 
  -- but standard RLS is the first line of defense for a "Gatekeeper".
  constraint user_id_unique unique (user_id)
);

-- RLS Policies
alter table public.applications enable row level security;

-- Users can insert their own application
create policy "Users can insert their own application"
on public.applications for insert
to authenticated
with check (auth.uid() = user_id);

-- Users can read their own application
create policy "Users can view their own application"
on public.applications for select
to authenticated
using (auth.uid() = user_id);

-- Only admins/service_role can read all (default deny for others)
