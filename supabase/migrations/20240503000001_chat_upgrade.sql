-- Phase 2: Rich Messaging & Vault Enhancements

-- 1. ENHANCE MESSAGES TABLE
-- Add support for different message types (text, image, agreement, vault_key)
-- Add metadata for structured content (e.g., agreement terms)
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'text', -- 'text', 'image', 'agreement', 'vault_key'
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. VAULT ACCESS tracking (if not already handled in private_vault array, but granular is better)
-- We already have granted_to in private_vault, but let's ensure we can track specific key exchanges if needed.
-- For now, the existing private_vault.granted_to array is sufficient for valid viewers.
-- But a 'vault_keys' table could track active shared keys if we want expiration/revocation per share.
-- Let's stick to the simple array for now as per previous schema, but ensure RLS is solid.

-- 3. ENSURE RLS FOR UPDATED MESSAGES
-- Existing policies should cover the new columns, but let's double check.
-- No new policies needed if mostly adding columns.

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
