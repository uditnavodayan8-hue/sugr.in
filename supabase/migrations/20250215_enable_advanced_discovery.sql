-- Combined Migration for Advanced Discovery Features
-- 1. Enable PostGIS
-- 2. Add Location Columns
-- 3. Create Nearby Profiles RPC

-- ============================================================
-- 1. Enable PostGIS for geospatial queries
-- ============================================================
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- ============================================================
-- 2. Add location columns to profiles
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT);

-- Create index for faster geospatial queries
CREATE INDEX IF NOT EXISTS profiles_location_idx ON public.profiles USING GIST (location);

-- Function to automatically update 'location' geography column when lat/long changes
CREATE OR REPLACE FUNCTION update_profile_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the function before insert or update
DROP TRIGGER IF EXISTS update_profile_location_trigger ON public.profiles;
CREATE TRIGGER update_profile_location_trigger
BEFORE INSERT OR UPDATE OF latitude, longitude ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_location();

-- Update existing profiles (backfill location if lat/long exists)
UPDATE public.profiles
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================================
-- 3. RPC function to get discovery feed with geospatial filtering
-- ============================================================
CREATE OR REPLACE FUNCTION get_nearby_profiles(
  lat DOUBLE PRECISION,
  long DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 100000, -- Default huge radius if not specified
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
        radius_km * 1000 -- Convert km to meters
      )
    )
    AND p.id NOT IN (
      SELECT target_id FROM public.swipes WHERE actor_id = curr_user_id
    )
  ORDER BY
    p.sugr_index DESC,
    p.last_seen DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;
