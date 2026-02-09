import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Profile } from '@/lib/services/profiles';
import { getDailyPicks } from '@/lib/services/curation';
import { checkDailyStreak } from '@/lib/services/retention';

export default async function DashboardPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Component context
                    }
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile?.role) {
        redirect('/onboarding');
    }


    // Determine target role for discovery
    const targetRole = profile.role === 'provider' ? 'protege' : 'provider';

    // Fetch profiles for the swipe feed
    // Exclude current user and filter by opposite role
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*, photos:profile_photos(*)')
        .neq('id', user.id)
        .eq('role', targetRole)
        .not('avatar_url', 'is', null) // Only show valid profiles
        .order('last_seen', { ascending: false }) // Show active users first
        .limit(20);

    if (error) {
        console.error("Error fetching profiles:", error);
    }

    // Ensure type safety
    const initialProfiles = (profiles || []) as unknown as Profile[];

    // Fetch Engagement Data
    const dailyPicks = await getDailyPicks(user.id);
    const streakData = await checkDailyStreak(user.id);

    return (
        <DashboardContent
            initialProfiles={initialProfiles}
            currentUserId={user.id}
            dailyPicks={dailyPicks}
            streak={streakData?.current_streak || 0}
        />
    );
}
