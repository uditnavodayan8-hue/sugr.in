import { getSupabaseClient } from '../supabase/client';

export interface Ad {
    id: string;
    user_id: string;
    type: 'Travel' | 'Dinner' | 'Event' | 'Long-term';
    content: string;
    location: string;
    media_url?: string;
    expires_at: string;
    created_at: string;
    profile?: {
        name: string;
        avatar_url: string | null;
        role: 'Provider' | 'Protégé';
        sugr_index: number;
    };
}

const supabase = getSupabaseClient();

/**
 * Create a new ephemeral Broadcast Ad
 */
export async function createAd(
    userId: string,
    adData: Pick<Ad, 'type' | 'content' | 'location' | 'media_url'>
): Promise<Ad | null> {
    const { data, error } = await supabase
        .from('ads')
        .insert({
            user_id: userId,
            ...adData,
            // expires_at defaults to 24h in SQL, but we can set explicit if needed
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating ad:', error);
        return null;
    }

    return data as Ad;
}

/**
 * Get active ads for the Discovery Feed
 */
export async function getActiveAds(): Promise<Ad[]> {
    const { data, error } = await supabase
        .from('ads')
        .select(`
            *,
            profile:profiles!ids(name, avatar_url, role, sugr_index)
        `)
        .gt('expires_at', new Date().toISOString()) // Only future expiration
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching ads:', error);
        return [];
    }

    return (data as any[]).map(item => ({
        ...item,
        profile: item.profile // Flat map if needed, but Supabase returns nested object
    }));
}

/**
 * Delete an ad (e.g. if fulfilled)
 */
export async function deleteAd(adId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId)
        .eq('user_id', userId);

    return !error;
}
