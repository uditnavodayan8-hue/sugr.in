-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- Add location columns to profiles
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

-- Update existing profiles (if any have lat/long manually set, though unlikely)
UPDATE public.profiles
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
