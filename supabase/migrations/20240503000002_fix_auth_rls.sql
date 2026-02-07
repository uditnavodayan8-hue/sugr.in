-- Fix Auth & RLS Policies
-- Run this to ensure users can participate in the platform

-- 1. Ensure Profiles RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policies
-- Allow users to insert their own profile on signup
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Allow everyone to view profiles (needed for Discovery)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- 3. Storage Policies for Avatars
-- (Assuming 'avatars' bucket exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
CREATE POLICY "Anyone can upload an avatar"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Anyone can update an avatar" ON storage.objects;
CREATE POLICY "Anyone can update an avatar"
ON storage.objects FOR UPDATE
WITH CHECK ( bucket_id = 'avatars' );

-- 4. Fix "Private Vault" RLS
ALTER TABLE private_vault ENABLE ROW LEVEL SECURITY;

-- create policy "Owner can manage vault"
DROP POLICY IF EXISTS "Owner can manage vault" ON private_vault;
CREATE POLICY "Owner can manage vault" ON private_vault 
FOR ALL USING (auth.uid() = owner_id);

-- create policy "Granted users can view"
DROP POLICY IF EXISTS "Granted users can view" ON private_vault;
CREATE POLICY "Granted users can view" ON private_vault 
FOR SELECT USING (auth.uid() = ANY(granted_to));
