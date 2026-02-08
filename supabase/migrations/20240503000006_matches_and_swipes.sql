-- Migration to add Matches table and enhance feed logic

-- 1. Create Matches Table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_a UUID REFERENCES profiles(id) ON DELETE CASCADE,
    user_b UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active', -- 'active', 'unmatched', 'blocked'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_a, user_b)
);

-- 2. Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can see matches they are part of
CREATE POLICY "Users can view their own matches" ON matches
    FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);

-- System/Server functions or triggers usually handle strict creation, 
-- but we allow users to insert if they are part of the match (for now, via RPC/API)
CREATE POLICY "Users can insert matches if they are involved" ON matches
    FOR INSERT WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_user_a ON matches(user_a);
CREATE INDEX IF NOT EXISTS idx_matches_user_b ON matches(user_b);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_matches_updated_at
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Messages RLS (Ensure only match participants can read/write)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read messages from their matches" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = messages.match_id
            AND (m.user_a = auth.uid() OR m.user_b = auth.uid())
        )
    );

CREATE POLICY "Users can send messages to their matches" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM matches m
            WHERE m.id = messages.match_id
            AND (m.user_a = auth.uid() OR m.user_b = auth.uid())
            AND m.status = 'active'
        )
    );
