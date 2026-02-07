-- Fix Profiles Schema: Add full_name
-- The codebase expects 'full_name' but the database has 'name'.

-- 1. Add full_name column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 2. Backfill full_name from name
UPDATE profiles 
SET full_name = name 
WHERE full_name IS NULL AND name IS NOT NULL;

-- 3. Make sure it stays in sync (optional, or just use full_name going forward)
-- For now, we just ensure the column exists so the app doesn't crash.
