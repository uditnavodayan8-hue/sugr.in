-- Combined Migration for Safety Features
-- 1. Create reports and blocks tables
-- 2. Update Discovery RPC to exclude blocked users

-- ============================================================
-- 1. Create Safety Tables
-- ============================================================

-- Create reports table to track user complaints
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending', -- pending, resolved, dismissed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocks table to prevent users from interacting
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Reports Policies
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid()::text = reporter_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid()::text = reporter_id);

-- Blocks Policies
DROP POLICY IF EXISTS "Users can create blocks" ON public.blocks;
CREATE POLICY "Users can create blocks" ON public.blocks
    FOR INSERT WITH CHECK (auth.uid()::text = blocker_id);

DROP POLICY IF EXISTS "Users can delete their own blocks" ON public.blocks;
CREATE POLICY "Users can delete their own blocks" ON public.blocks
    FOR DELETE USING (auth.uid()::text = blocker_id);

DROP POLICY IF EXISTS "Users can view their own blocks" ON public.blocks;
CREATE POLICY "Users can view their own blocks" ON public.blocks
    FOR SELECT USING (auth.uid()::text = blocker_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_target ON public.reports(target_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON public.blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON public.blocks(blocked_id);


-- ============================================================
-- 2. Update Discovery RPC to Exclude Blocked Users
-- ============================================================

CREATE OR REPLACE FUNCTION get_nearby_profiles(
  lat DOUBLE PRECISION,
  long DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 100000,
  min_age INT DEFAULT 18,
  max_age INT DEFAULT 100,
  target_role user_role DEFAULT NULL,
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  username TEXT,
  avatar_url TEXT,
  age INTEGER,
  city TEXT,
  role user_role,
  lifestyle_tier ad_tier,
  sugr_index INTEGER,
  last_seen TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN,
  distance_km DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  curr_user_id TEXT;
BEGIN
  -- Get current user ID
  curr_user_id := auth.uid()::text;

  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.username,
    p.avatar_url,
    p.age,
    p.city,
    p.role,
    p.lifestyle_tier,
    p.sugr_index,
    p.last_seen,
    p.is_verified,
    (ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography
    ) / 1000) AS distance_km
  FROM
    public.profiles p
  WHERE
    p.id <> curr_user_id
    AND (target_role IS NULL OR p.role = target_role)
    AND p.age BETWEEN min_age AND max_age
    AND (
      lat IS NULL OR long IS NULL OR
      ST_DWithin(
        p.location,
        ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography,
        radius_km * 1000
      )
    )
    -- Exclude Swiped Users
    AND p.id NOT IN (
      SELECT target_id FROM public.swipes WHERE actor_id = curr_user_id
    )
    -- Exclude users who I blocked
    AND p.id NOT IN (
      SELECT blocked_id FROM public.blocks WHERE blocker_id = curr_user_id
    )
    -- Exclude users who blocked me
    AND p.id NOT IN (
      SELECT blocker_id FROM public.blocks WHERE blocked_id = curr_user_id
    )
  ORDER BY
    p.sugr_index DESC,
    p.last_seen DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;
