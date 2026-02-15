-- Create reports table to track user complaints
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending', -- pending, resolved, dismissed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocks table to prevent users from interacting
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Reports Policies
CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid()::text = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid()::text = reporter_id);

-- Blocks Policies
CREATE POLICY "Users can create blocks" ON public.blocks
    FOR INSERT WITH CHECK (auth.uid()::text = blocker_id);

CREATE POLICY "Users can delete their own blocks" ON public.blocks
    FOR DELETE USING (auth.uid()::text = blocker_id);

CREATE POLICY "Users can view their own blocks" ON public.blocks
    FOR SELECT USING (auth.uid()::text = blocker_id);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_reports_target ON public.reports(target_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON public.blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON public.blocks(blocked_id);
