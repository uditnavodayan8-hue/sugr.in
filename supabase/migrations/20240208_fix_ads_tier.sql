-- Fix Ads Table: Add tier column if missing
-- The error "Could not find the 'tier' column of 'ads' in the schema cache" indicates this is missing.

-- 1. Ensure the enum type ad_tier exists
DO $$ BEGIN
    CREATE TYPE ad_tier AS ENUM ('executive', 'elite', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add the column
ALTER TABLE ads ADD COLUMN IF NOT EXISTS tier ad_tier DEFAULT 'executive';

-- 3. Reload schema cache (optional, happens automatically usually)
NOTIFY pgrst, 'reload schema';
