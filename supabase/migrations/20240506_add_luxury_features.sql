-- Add luxury columns to profiles table
ALTER TABLE "public"."profiles" 
ADD COLUMN IF NOT EXISTS "images" text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "occupation" text,
ADD COLUMN IF NOT EXISTS "allowance_range" text,
ADD COLUMN IF NOT EXISTS "looking_for" text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "lifestyle_tags" text[] DEFAULT '{}';

-- Create trips table
CREATE TABLE IF NOT EXISTS "public"."trips" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "user_id" uuid REFERENCES "public"."profiles"("id") ON DELETE CASCADE NOT NULL,
    "destination" text NOT NULL,
    "start_date" date NOT NULL,
    "end_date" date NOT NULL,
    "description" text,
    "allowance_offer" text,
    "status" text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
    "created_at" timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on trips
ALTER TABLE "public"."trips" ENABLE ROW LEVEL SECURITY;

-- Trips policies
CREATE POLICY "Trips are viewable by everyone" ON "public"."trips"
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own trips" ON "public"."trips"
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON "public"."trips"
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON "public"."trips"
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS trips_user_id_idx ON "public"."trips" ("user_id");
CREATE INDEX IF NOT EXISTS trips_status_idx ON "public"."trips" ("status");
