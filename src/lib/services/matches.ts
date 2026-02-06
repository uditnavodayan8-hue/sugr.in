import { getSupabaseClient } from '../supabase/client';
import { createNotification } from './notifications';
import { getProfile } from './profiles';

export interface Swipe {
    id: string;
    actor_id: string;
    target_id: string;
    action: 'like' | 'pass' | 'superlike';
    created_at: string;
}

export interface Match {
    id: string;
    user_a: string;
    user_b: string;
    status: 'active' | 'expired' | 'unmatched';
    expires_at: string;
    created_at: string;
}

const supabase = getSupabaseClient();

/**
 * Create a swipe action (like, pass, or superlike)
 */
export async function createSwipe(
    actorId: string,
    targetId: string,
    action: 'like' | 'pass' | 'superlike'
): Promise<{ swipe: Swipe | null; isMatch: boolean }> {
    // Insert the swipe
    const { data: swipe, error } = await supabase
        .from('swipes')
        .insert({
            actor_id: actorId,
            target_id: targetId,
            action,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating swipe:', error);
        return { swipe: null, isMatch: false };
    }

    // Check for mutual like only if this was a like/superlike
    if (action === 'pass') {
        return { swipe: swipe as Swipe, isMatch: false };
    }

    // Check if target has already liked actor
    const { data: mutualSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('actor_id', targetId)
        .eq('target_id', actorId)
        .in('action', ['like', 'superlike'])
        .single();

    if (mutualSwipe) {
        // Create a match!
        const match = await createMatch(actorId, targetId);

        // Notify both users
        try {
            // Get actor name for the notification
            const actor = await getProfile(actorId);

            // Notify Target (The one who liked first and just got matched)
            await createNotification({
                user_id: targetId,
                type: 'match',
                title: "It's a Match! ✨",
                body: `You matched with ${actor?.name || 'someone'}!`,
                data: { matchId: match?.id, partnerId: actorId }
            });

            // Notify Actor (The one who just swiped)
            await createNotification({
                user_id: actorId,
                type: 'match',
                title: "It's a Match! ✨",
                body: "You have a new connection.",
                data: { matchId: match?.id, partnerId: targetId }
            });
        } catch (err) {
            console.error('Error sending match notifications:', err);
        }

        return { swipe: swipe as Swipe, isMatch: !!match };
    }

    return { swipe: swipe as Swipe, isMatch: false };
}

/**
 * Create a match between two users
 */
async function createMatch(userA: string, userB: string): Promise<Match | null> {
    const { data, error } = await supabase
        .from('matches')
        .insert({
            user_a: userA,
            user_b: userB,
            status: 'active',
            expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48h from now
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating match:', error);
        return null;
    }

    return data as Match;
}

/**
 * Get all active matches for a user
 */
export async function getMatches(userId: string): Promise<Match[]> {
    const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString()) // Filter out expired matches
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching matches:', error);
        return [];
    }

    return (data as Match[]) || [];
}

/**
 * Get a single match by ID
 */
export async function getMatch(matchId: string): Promise<Match | null> {
    const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

    if (error) {
        console.error('Error fetching match:', error);
        return null;
    }

    return data as Match;
}

/**
 * Extend a match due to activity (48h from now)
 */
export async function extendMatch(matchId: string): Promise<boolean> {
    const { error } = await supabase
        .from('matches')
        .update({
            expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', matchId);

    if (error) {
        console.error('Error extending match:', error);
        return false;
    }
    return true;
}

/**
 * Unmatch (set status to 'unmatched')
 */
export async function unmatch(matchId: string): Promise<boolean> {
    const { error } = await supabase
        .from('matches')
        .update({ status: 'unmatched' })
        .eq('id', matchId);

    if (error) {
        console.error('Error unmatching:', error);
        return false;
    }

    return true;
}

/**
 * Check if user has already swiped on target
 */
export async function hasSwipedOn(actorId: string, targetId: string): Promise<boolean> {
    const { data } = await supabase
        .from('swipes')
        .select('id')
        .eq('actor_id', actorId)
        .eq('target_id', targetId)
        .single();

    return !!data;
}

/**
 * Get IDs of profiles the user has already swiped on
 */
export async function getSwipedProfileIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('swipes')
        .select('target_id')
        .eq('actor_id', userId);

    if (error) {
        console.error('Error fetching swiped IDs:', error);
        return [];
    }

    return data?.map((s: { target_id: string }) => s.target_id) || [];
}
