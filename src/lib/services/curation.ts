import { getSupabaseClient } from '../supabase/client';
import { getDiscoveryProfiles, Profile } from './profiles';

export interface DailyPick {
    id: string;
    profile: Profile;
    expires_at: string;
}

const supabase = getSupabaseClient();

export async function getDailyPicks(userId: string): Promise<DailyPick[]> {
    // 1. Check existing picks
    const { data: existingPicks, error } = await supabase
        .from('daily_picks')
        .select('*, profile:profiles(*)') // Join with profiles
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString()); // Only valid ones

    if (error) {
        console.error('Error fetching daily picks:', error);
        return [];
    }

    if (existingPicks && existingPicks.length > 0) {
        // Transform to DailyPick
        return existingPicks.map((p: any) => ({
            id: p.id,
            profile: p.profile,
            expires_at: p.expires_at
        }));
    }

    // 2. Generate new picks if none exist
    return await generateDailyPicks(userId);
}

async function generateDailyPicks(userId: string): Promise<DailyPick[]> {
    // Fetch random profiles from discovery
    // In a real app, this would be a sophisticated algorithm
    // For now, we fetch 20 and pick 5 random ones
    const profiles = await getDiscoveryProfiles(userId, { limit: 20 });

    if (profiles.length === 0) return [];

    // Shuffle and pick 5
    const shuffled = profiles.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const picks: DailyPick[] = [];

    // Insert into DB
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);

    for (const profile of selected) {
        const { data, error } = await supabase
            .from('daily_picks')
            .insert({
                user_id: userId,
                profile_id: profile.id,
                expires_at: expiry.toISOString()
            })
            .select()
            .single(); // insert return isn't joined, so we reconstruct

        if (!error && data) {
            picks.push({
                id: data.id,
                profile: profile,
                expires_at: data.expires_at
            });
        }
    }

    return picks;
}
