-- Fix Foreign Keys: Change all UUID foreign keys to TEXT references
-- This updates all tables that reference profiles.id

-- STEP 0: Drop ALL policies that depend on the columns we're changing
-- We need to drop all policies because we can't predict all policy names

-- Drop all policies on ads table
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'ads' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.ads', pol.policyname);
  END LOOP;
END $$;

-- Drop all policies on access_requests table
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'access_requests' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.access_requests', pol.policyname);
  END LOOP;
END $$;

-- Drop all policies on private_vault table
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'private_vault' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.private_vault', pol.policyname);
  END LOOP;
END $$;

-- Drop all policies on broadcasts table (if exists)
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'broadcasts' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.broadcasts', pol.policyname);
  END LOOP;
END $$;

-- Drop all policies on swipes table (if exists)
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'swipes' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.swipes', pol.policyname);
  END LOOP;
END $$;

-- Drop all policies on matches table (if exists)
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'matches' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.matches', pol.policyname);
  END LOOP;
END $$;

-- Drop all policies on messages table (if exists)
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.messages', pol.policyname);
  END LOOP;
END $$;


-- 1. Fix ads table
ALTER TABLE public.ads DROP CONSTRAINT IF EXISTS ads_user_id_fkey;
ALTER TABLE public.ads ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.ads ADD CONSTRAINT ads_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. Fix access_requests table
ALTER TABLE public.access_requests DROP CONSTRAINT IF EXISTS access_requests_requester_id_fkey;
ALTER TABLE public.access_requests DROP CONSTRAINT IF EXISTS access_requests_target_id_fkey;
ALTER TABLE public.access_requests ALTER COLUMN requester_id TYPE TEXT;
ALTER TABLE public.access_requests ALTER COLUMN target_id TYPE TEXT;
ALTER TABLE public.access_requests ADD CONSTRAINT access_requests_requester_id_fkey 
  FOREIGN KEY (requester_id) REFERENCES public.profiles(id);
ALTER TABLE public.access_requests ADD CONSTRAINT access_requests_target_id_fkey 
  FOREIGN KEY (target_id) REFERENCES public.profiles(id);

-- 3. Fix private_vault table
ALTER TABLE public.private_vault DROP CONSTRAINT IF EXISTS private_vault_owner_id_fkey;
ALTER TABLE public.private_vault ALTER COLUMN owner_id TYPE TEXT;
ALTER TABLE public.private_vault ALTER COLUMN granted_to TYPE TEXT[];
ALTER TABLE public.private_vault ADD CONSTRAINT private_vault_owner_id_fkey 
  FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. Fix broadcasts table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'broadcasts') THEN
    ALTER TABLE public.broadcasts DROP CONSTRAINT IF EXISTS broadcasts_user_id_fkey;
    ALTER TABLE public.broadcasts ALTER COLUMN user_id TYPE TEXT;
    ALTER TABLE public.broadcasts ADD CONSTRAINT broadcasts_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 5. Fix swipes table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'swipes') THEN
    ALTER TABLE public.swipes DROP CONSTRAINT IF EXISTS swipes_actor_id_fkey;
    ALTER TABLE public.swipes DROP CONSTRAINT IF EXISTS swipes_target_id_fkey;
    ALTER TABLE public.swipes ALTER COLUMN actor_id TYPE TEXT;
    ALTER TABLE public.swipes ALTER COLUMN target_id TYPE TEXT;
    ALTER TABLE public.swipes ADD CONSTRAINT swipes_actor_id_fkey 
      FOREIGN KEY (actor_id) REFERENCES public.profiles(id);
    ALTER TABLE public.swipes ADD CONSTRAINT swipes_target_id_fkey 
      FOREIGN KEY (target_id) REFERENCES public.profiles(id);
  END IF;
END $$;

-- 6. Fix matches table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'matches') THEN
    ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS matches_user_a_fkey;
    ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS matches_user_b_fkey;
    ALTER TABLE public.matches ALTER COLUMN user_a TYPE TEXT;
    ALTER TABLE public.matches ALTER COLUMN user_b TYPE TEXT;
    ALTER TABLE public.matches ADD CONSTRAINT matches_user_a_fkey 
      FOREIGN KEY (user_a) REFERENCES public.profiles(id);
    ALTER TABLE public.matches ADD CONSTRAINT matches_user_b_fkey 
      FOREIGN KEY (user_b) REFERENCES public.profiles(id);
  END IF;
END $$;

-- 7. Fix messages table (if it has sender_id)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'sender_id') THEN
    ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
    ALTER TABLE public.messages ALTER COLUMN sender_id TYPE TEXT;
    ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey 
      FOREIGN KEY (sender_id) REFERENCES public.profiles(id);
  END IF;
END $$;

-- STEP 8: Recreate policies with permissive rules (Clerk handles auth)
-- Ads policies
CREATE POLICY "Ads are viewable by everyone" 
ON public.ads FOR SELECT 
USING (expires_at > NOW());

CREATE POLICY "Service role can manage ads" 
ON public.ads FOR ALL 
USING (true);

-- Access requests policies
CREATE POLICY "Service role can manage access requests" 
ON public.access_requests FOR ALL 
USING (true);

-- Private vault policies
CREATE POLICY "Service role can manage vault" 
ON public.private_vault FOR ALL 
USING (true);

