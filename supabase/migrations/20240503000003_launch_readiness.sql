-- Launch Readiness: Storage & Logic
-- Run this to finalize backend for launch

-- 1. Storage: Public 'posts' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posts', 'posts', true) 
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Posts are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own posts" ON storage.objects;

CREATE POLICY "Public Posts are viewable by everyone" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'posts' );

CREATE POLICY "Users can upload their own posts" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Users can update their own posts" 
ON storage.objects FOR UPDATE 
WITH CHECK ( bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Users can delete their own posts" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1] );


-- 2. Storage: Private 'vault' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vault', 'vault', false) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Owner can manage vault objects" ON storage.objects;
DROP POLICY IF EXISTS "Granted users can view vault objects" ON storage.objects;

-- Vault RLS: Owner has full access
CREATE POLICY "Owner can manage vault objects" 
ON storage.objects FOR ALL 
USING ( bucket_id = 'vault' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Vault RLS: Granted users can VIEW
-- Matches the file name in storage to the media_url in private_vault table
CREATE POLICY "Granted users can view vault objects" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'vault' AND
  EXISTS (
    SELECT 1 FROM private_vault
    WHERE private_vault.media_url LIKE '%' || storage.objects.name
    AND (auth.uid() = ANY(private_vault.granted_to))
  )
);


-- 3. RPC: Grant Vault Access
CREATE OR REPLACE FUNCTION grant_vault_access(asset_id UUID, target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE private_vault
  SET granted_to = array_append(granted_to, target_user_id)
  WHERE id = asset_id
  AND owner_id = auth.uid()
  AND NOT (granted_to @> ARRAY[target_user_id]); -- Prevent duplicates
END;
$$;


-- 4. Ad Indexing: Hide Expired Ads
-- Update standard policy to filter out expired ads
DROP POLICY IF EXISTS "Ads are viewable by everyone" ON ads;
CREATE POLICY "Ads are viewable by everyone" 
ON ads FOR SELECT 
USING ( expires_at > NOW() );
