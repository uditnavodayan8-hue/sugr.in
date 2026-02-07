-- Sugr Index Calculation Trigger
-- Automatically updates user score based on profile completeness

CREATE OR REPLACE FUNCTION calculate_sugr_index()
RETURNS TRIGGER AS $$
BEGIN
  -- Base Score
  NEW.sugr_index := 50;
  
  -- Add points for avatar
  IF NEW.avatar_url IS NOT NULL THEN
    NEW.sugr_index := NEW.sugr_index + 15;
  END IF;

  -- Add points for bio
  IF NEW.bio IS NOT NULL AND length(NEW.bio) > 10 THEN
    NEW.sugr_index := NEW.sugr_index + 15;
  END IF;

  -- Add points for verification
  IF NEW.is_verified = TRUE THEN
    NEW.sugr_index := NEW.sugr_index + 20;
  END IF;

  -- Cap at 100
  IF NEW.sugr_index > 100 THEN
    NEW.sugr_index := 100;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_sugr_index ON profiles;
CREATE TRIGGER tr_sugr_index
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION calculate_sugr_index();
