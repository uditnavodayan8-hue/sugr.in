-- 1. Create Broadcasts Table (Safe)
create table if not exists broadcasts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  likes_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. RLS for Broadcasts (Drop first to ensure clean state)
alter table broadcasts enable row level security;

drop policy if exists "Broadcasts are viewable by everyone" on broadcasts;
create policy "Broadcasts are viewable by everyone"
  on broadcasts for select
  using (true);

drop policy if exists "Users can create broadcasts" on broadcasts;
create policy "Users can create broadcasts"
  on broadcasts for insert
  with check (auth.uid() = user_id);

-- 3. Create Storage Buckets (Safe)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('broadcast_media', 'broadcast_media', true)
on conflict (id) do nothing;

-- 4. Storage Policies for Avatars (Drop first to avoid "already exists" error)
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

drop policy if exists "Anyone can upload an avatar" on storage.objects;
create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner );
