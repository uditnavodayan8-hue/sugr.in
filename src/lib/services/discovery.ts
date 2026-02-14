import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import type { Profile } from './profile';

export interface DiscoveryFilters {
    ageMin?: number;
    ageMax?: number;
    maxDistance?: number; // in km
    verifiedOnly?: boolean;
    lifestyleMin?: number;
    lifestyleMax?: number;
}

/**
 * Get discovery feed with smart filtering
 * Returns users that match preferences and haven't been swiped yet
 */
export async function getDiscoveryFeed(
    filters: DiscoveryFilters = {},
    limit: number = 20
): Promise<Profile[]> {
    const { userId } = auth();
    if (!userId) return [];

    const supabase = createClient();

    // Get user's own profile to check their role
    const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    if (!userProfile) return [];

    // Build query - show opposite role
    let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', userId) // Exclude self
        .not('role', 'is', null); // Must have a role

    // Filter by opposite role
    if (userProfile.role === 'provider') {
        query = query.eq('role', 'protege');
    } else if (userProfile.role === 'protege') {
        query = query.eq('role', 'provider');
    }

    // Age filter
    if (filters.ageMin) {
        query = query.gte('age', filters.ageMin);
    }
    if (filters.ageMax) {
        query = query.lte('age', filters.ageMax);
    }

    // Verified only filter
    if (filters.verifiedOnly) {
        query = query.eq('is_verified', true);
    }

    // Get already swiped users to exclude
    const { data: swipes } = await supabase
        .from('swipes')
        .select('target_id')
        .eq('actor_id', userId);

    if (swipes && swipes.length > 0) {
        const swipedIds = swipes.map(s => s.target_id);
        query = query.not('id', 'in', `(${swipedIds.join(',')})`);
    }

    // Order by sugr_index (highest first) and limit results
    query = query
        .order('sugr_index', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching discovery feed:', error);
        return [];
    }

    return data || [];
}

/**
 * Create a swipe action
 */
export async function createSwipe(
    targetId: string,
    action: 'like' | 'pass' | 'superlike'
): Promise<{ matched: boolean; matchId?: string }> {
    const { userId } = auth();
    if (!userId) throw new Error('Not authenticated');

    const supabase = createClient();

    // Insert the swipe
    const { error: swipeError } = await supabase
        .from('swipes')
        .insert({
            actor_id: userId,
            target_id: targetId,
            action,
        });

    if (swipeError) {
        console.error('Error creating swipe:', swipeError);
        throw swipeError;
    }

    // If this was a 'like' or 'superlike', check for mutual match
    if (action === 'like' || action === 'superlike') {
        const { data: mutualSwipe } = await supabase
            .from('swipes')
            .select('*')
            .eq('actor_id', targetId)
            .eq('target_id', userId)
            .in('action', ['like', 'superlike'])
            .single();

        if (mutualSwipe) {
            // Create match!
            const { data: match, error: matchError } = await supabase
                .from('matches')
                .insert({
                    user_a: userId < targetId ? userId : targetId, // Always store smaller ID first
                    user_b: userId < targetId ? targetId : userId,
                    status: 'active',
                })
                .select()
                .single();

            if (matchError) {
                console.error('Error creating match:', matchError);
            } else if (match) {
                return { matched: true, matchId: match.id };
            }
        }
    }

    return { matched: false };
}

/**
 * Get user's matches
 */
export async function getMatches(): Promise<any[]> {
    const { userId } = auth();
    if (!userId) return [];

    const supabase = createClient();

    const { data, error } = await supabase
        .from('matches')
        .select(`
      *,
      user_a_profile:profiles!matches_user_a_fkey(*),
      user_b_profile:profiles!matches_user_b_fkey(*)
    `)
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching matches:', error);
        return [];
    }

    // Format matches to show the OTHER person
    return (data || []).map(match => ({
        ...match,
        profile: match.user_a === userId ? match.user_b_profile : match.user_a_profile,
    }));
}

/**
 * Check if two users have matched
 */
export async function checkMatch(userId1: string, userId2: string): Promise<boolean> {
    const supabase = createClient();

    const { data } = await supabase
        .from('matches')
        .select('id')
        .or(`and(user_a.eq.${userId1},user_b.eq.${userId2}),and(user_a.eq.${userId2},user_b.eq.${userId1})`)
        .eq('status', 'active')
        .single();

    return !!data;
}
