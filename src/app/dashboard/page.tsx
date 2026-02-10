import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Profile } from '@/lib/services/profiles';
import { getDailyPicks } from '@/lib/services/curation';
import { checkDailyStreak } from '@/lib/services/retention';
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
    const { userId, getToken } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/');
    }

    const adminSupabase = createAdminClient();

    // 1. Ensure Profile Exists with default values
    const { data: profile, error } = await adminSupabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    let currentProfile = profile;

    if (!currentProfile) {
        console.log("Profile missing, creating with defaults...");
        const autoUsername = user.firstName
            ? `${user.firstName.toLowerCase()}${userId.slice(-4)}`
            : `user_${userId.slice(-6)}`;

        const { data: newProfile, error: createError } = await adminSupabase
            .from('profiles')
            .insert({
                id: userId,
                username: autoUsername,
                full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
                avatar_url: user.imageUrl,
                role: null, // Force onboarding
                lifestyle_tier: 'executive',
                bio: '',
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (createError) {
            console.error("Failed to create profile:", createError);
        }
        currentProfile = newProfile;
    }

    // 2. Redirect to Onboarding if incomplete
    if (!currentProfile?.role) {
        redirect('/onboarding');
    }

    // 3. Normal Data Fetching
    const token = await getToken({ template: 'supabase' });
    const supabase = await createClient(token || undefined);

    // Fetch all profiles for the swipe feed (not filtering by role)
    const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('*, photos:profile_photos(*)')
        .neq('id', userId)
        // .not('avatar_url', 'is', null) // Temporarily allow no-avatar profiles for testing
        // .order('last_seen', { ascending: false }) // Column likely missing
        .limit(20);

    if (fetchError) {
        console.error("Error fetching profiles:", fetchError);
    }

    const initialProfiles = (profiles || []) as unknown as Profile[];
    const dailyPicks = await getDailyPicks(userId, supabase);
    const streakData = await checkDailyStreak(userId, supabase);

    return (
        <DashboardContent
            initialProfiles={initialProfiles}
            currentUserId={userId}
            dailyPicks={dailyPicks}
            streak={streakData?.current_streak || 0}
            userHasAvatar={!!currentProfile?.avatar_url}
        />
    );
}
