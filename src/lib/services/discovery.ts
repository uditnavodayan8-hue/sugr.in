"use server";

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
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = await createClient();

    // Get user's own profile to check their role and location
    const { data: userProfile } = await supabase
        .from('profiles')
        .select('role, latitude, longitude')
        .eq('id', userId)
        .single();

    if (!userProfile) return [];

    const currentUser = userProfile as { role: 'provider' | 'protege'; latitude?: number; longitude?: number };

    const currentUser = userProfile as { role: 'provider' | 'protege'; latitude?: number; longitude?: number };

    // Determine target role
    let targetRole: 'provider' | 'protege' | null = null;
    if (userProfile.role === 'provider') {
        targetRole = 'protege';
    } else if (userProfile.role === 'protege') {
        targetRole = 'provider';
    }

    // Use RPC for smart discovery
    // Default to San Francisco if no location (or handle client-side)
    // In a real app, you'd pass the user's current location from client or store it in profile
    const lat = userProfile.latitude || 37.7749;
    const long = userProfile.longitude || -122.4194;

    const { data, error } = await supabase.rpc('get_nearby_profiles', {
        lat,
        long,
        radius_km: filters.maxDistance || 10000, // Default to global-ish if not set
        min_age: filters.ageMin || 18,
        max_age: filters.ageMax || 100,
        target_role: targetRole,
        limit_count: limit,
        offset_count: 0 // TODO: Add pagination support
    });

    if (error) {
        console.error('Error fetching discovery feed:', error);
        return [];
    }

    return (data || []) as Profile[];
}

/**
 * Create a swipe action
 */
export async function createSwipe(
    targetId: string,
    action: 'like' | 'pass' | 'superlike'
): Promise<{ matched: boolean; matchId?: string }> {
    const { userId } = await auth();
    if (!userId) throw new Error('Not authenticated');

    const supabase = await createClient();

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
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = await createClient();

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
    const supabase = await createClient();

    const { data } = await supabase
        .from('matches')
        .select('id')
        .or(`and(user_a.eq.${userId1},user_b.eq.${userId2}),and(user_a.eq.${userId2},user_b.eq.${userId1})`)
        .eq('status', 'active')
        .single();

    return !!data;
}
