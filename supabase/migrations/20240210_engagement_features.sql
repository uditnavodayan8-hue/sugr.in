-- Create daily_streaks table
CREATE TABLE IF NOT EXISTS public.daily_streaks (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    last_login_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily_picks table
CREATE TABLE IF NOT EXISTS public.daily_picks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    CONSTRAINT unique_daily_pick UNIQUE (user_id, profile_id, created_at)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT CHECK (tier IN ('free', 'gold', 'black')) DEFAULT 'free',
    status TEXT CHECK (status IN ('active', 'canceled', 'expired')) DEFAULT 'active',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.daily_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for daily_streaks
CREATE POLICY "Users can view their own streak" ON public.daily_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can update streaks" ON public.daily_streaks
    FOR ALL USING (auth.uid() = user_id); -- simplified for now, ideally service_role only

-- Policies for daily_picks
CREATE POLICY "Users can view their own picks" ON public.daily_picks
    FOR SELECT USING (auth.uid() = user_id);

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);
