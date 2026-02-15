-- Update RPC function to exclude blocked users
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
