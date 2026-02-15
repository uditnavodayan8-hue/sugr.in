create table if not exists public.user_settings (
    user_id text references public.profiles(id) on delete cascade primary key,
    push_new_matches boolean default true,
    push_new_messages boolean default true,
    push_profile_views boolean default false,
    privacy_mode boolean default false, -- Hide from discovery feed
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table public.user_settings enable row level security;

create policy "Users can manage their own settings" 
on public.user_settings for all 
using (auth.uid() = user_id);

-- Trigger to create settings on profile creation? 
-- Or app can handle it lazily. Lazy is fine for now.
