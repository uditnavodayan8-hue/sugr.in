-- Sugr "Otherworldly" Ecosystem - Database Schema
-- Run this in Supabase SQL Editor

-- 1. ENUMS & EXTENSIONS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('provider', 'protege');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ad_tier AS ENUM ('executive', 'elite', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILE ENHANCEMENTS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lifestyle_tier ad_tier;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sugr_index INT DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 3. THE AD FEED (Real-time & Ephemeral)
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tier ad_tier DEFAULT 'executive',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. THE ACCESS HANDSHAKE (The Social "Key")
CREATE TABLE IF NOT EXISTS access_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES profiles(id),
  target_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'granted', 'denied'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, target_id)
);

-- 5. PRIVATE VAULT (Encrypted Media References)
CREATE TABLE IF NOT EXISTS private_vault (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  is_revealed BOOLEAN DEFAULT FALSE,
  granted_to UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ENABLE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE ads;
ALTER PUBLICATION supabase_realtime ADD TABLE access_requests;

-- 7. ROW LEVEL SECURITY
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_vault ENABLE ROW LEVEL SECURITY;

-- Ads: Anyone can read, only owner can write
CREATE POLICY "Ads are viewable by everyone" ON ads FOR SELECT USING (true);
CREATE POLICY "Users can create their own ads" ON ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ads" ON ads FOR DELETE USING (auth.uid() = user_id);

-- Access Requests: Users can see their own requests
CREATE POLICY "Users can see requests involving them" ON access_requests 
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = target_id);
CREATE POLICY "Users can create requests" ON access_requests 
  FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Target can update request status" ON access_requests 
  FOR UPDATE USING (auth.uid() = target_id);

-- Private Vault: Only owner and granted users can see
CREATE POLICY "Owner can manage vault" ON private_vault 
  FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Granted users can view" ON private_vault 
  FOR SELECT USING (auth.uid() = ANY(granted_to));
