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

    // 3. Redirect to Discovery (New Design Feed)
    redirect('/discovery');
}
