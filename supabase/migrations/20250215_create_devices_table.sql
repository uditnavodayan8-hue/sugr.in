create table if not exists public.devices (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade not null,
  fcm_token text not null,
  platform text check (platform in ('ios', 'android', 'web')),
  last_active timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  unique(user_id, fcm_token)
);

alter table public.devices enable row level security;

create policy "Users can manage their own devices" 
on public.devices for all 
using (auth.uid() = user_id);

-- Index for fast lookups
create index if not exists idx_devices_user_id on public.devices(user_id);
