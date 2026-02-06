-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Public Profile Data)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('Provider', 'Protégé')), -- Nullable for onboarding
  name text,
  age int,
  gender text,
  city text,
  bio text,
  avatar_url text,
  video_url text, -- For Vibe Check
  verification_level jsonb default '{"phone": false, "id": false, "social": false, "wealth": false}',
  trust_score int default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRIVATE KEYS (The Invite System)
create table invite_keys (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  owner_id uuid references profiles(id), -- Who owns this key (to give away)
  status text check (status in ('active', 'used', 'revoked')) default 'active',
  used_by uuid references profiles(id), -- Who used it to join
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SWIPES (The Match Engine)
create table swipes (
  id uuid default uuid_generate_v4() primary key,
  actor_id uuid references profiles(id) not null,
  target_id uuid references profiles(id) not null,
  action text check (action in ('like', 'pass', 'superlike')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(actor_id, target_id)
);

-- 4. MATCHES (Mutual Connections)
create table matches (
  id uuid default uuid_generate_v4() primary key,
  user_a uuid references profiles(id) not null,
  user_b uuid references profiles(id) not null,
  status text check (status in ('active', 'expired', 'unmatched')) default 'active',
  expires_at timestamp with time zone default timezone('utc'::text, now() + interval '48 hours') not null, -- 48h Ghost Rule
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. MESSAGES (Encrypted Chat)
create table messages (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references matches(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  content text, -- Text content
  media_url text, -- For images (WatermarkedViewer)
  is_one_time_view boolean default false, -- For Shadow Gallery
  viewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) --

-- Profiles: Publicly readable for now (filtered by API), editable only by self
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Keys: Only viewable by owner
alter table invite_keys enable row level security;
create policy "Users can see their own keys" on invite_keys for select using (auth.uid() = owner_id);

-- Matches: Only visible to participants
alter table matches enable row level security;
create policy "Users can see their matches" on matches for select using (auth.uid() = user_a or auth.uid() = user_b);

-- Messages: Only visible to participants of the match
alter table messages enable row level security;
create policy "Users can see messages in their matches" on messages for select using (
  exists (
    select 1 from matches m 
    where m.id = messages.match_id 
    and (auth.uid() = m.user_a or auth.uid() = m.user_b)
  )
);

-- 6. STORAGE BUCKETS (SECURITY)
-- Note: These must be created in the Storage UI first ('avatars', 'verification', 'vault')

-- Avatars: Publicly Readable
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

-- Verification: Strictly Private (Only User and Admins)
create policy "Verification docs are private"
  on storage.objects for select
  using ( bucket_id = 'verification' and auth.uid() = owner );

create policy "Users can upload verification docs"
  on storage.objects for insert
  with check ( bucket_id = 'verification' and auth.uid() = owner );

-- Vault: Private but shareable in Chat (Future Logic)
create policy "Vault items are owner-viewable"
  on storage.objects for select
  using ( bucket_id = 'vault' and auth.uid() = owner );

create policy "Users can upload to vault"
  on storage.objects for insert
  with check ( bucket_id = 'vault' and auth.uid() = owner );
