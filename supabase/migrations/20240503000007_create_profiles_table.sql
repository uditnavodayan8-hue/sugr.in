-- Create Profiles Table with Clerk-compatible TEXT IDs
-- This migration creates the profiles table that was referenced but never created

-- Create profiles table with TEXT id (Clerk uses string IDs like "user_...")
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,  -- Clerk user ID (not UUID!)
  email TEXT,
  name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  age INTEGER,
  city TEXT,
  role user_role,
  lifestyle_tier ad_tier DEFAULT 'executive',
  sugr_index INTEGER DEFAULT 1,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (but use permissive policies since Clerk handles auth)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Permissive for Clerk-based auth
-- Security is enforced by Clerk + Service Role Key in server actions
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
CREATE POLICY "Service role can manage profiles" 
ON profiles FOR ALL 
USING (true);

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_sugr_index ON profiles(sugr_index DESC);
