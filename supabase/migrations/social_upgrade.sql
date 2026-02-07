-- 1. Essential Profile Extensions
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('provider', 'protege')),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS lifestyle_tier TEXT,
ADD COLUMN IF NOT EXISTS sugr_index INT DEFAULT 1;

-- 2. The "Access Request" Table (The Social Handshake)
CREATE TABLE IF NOT EXISTS access_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES profiles(id),
  target_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'granted', 'denied'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. The "Pure" Ad Feed (Live Intent)
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours')
);
