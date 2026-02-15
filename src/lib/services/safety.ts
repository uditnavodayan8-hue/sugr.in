"use server";

import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Report a user for inappropriate behavior
 */
export async function reportUser(targetId: string, reason: string, details?: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Not authenticated');

    const supabase = await createClient();

    const { error } = await supabase
        .from('reports')
        .insert({
            reporter_id: userId,
            target_id: targetId,
            reason,
            details,
            status: 'pending'
        });

    if (error) {
        console.error('Error reporting user:', error);
        throw error;
    }

    return { success: true };
}

/**
 * Block a user to prevent further interaction
 */
export async function blockUser(targetId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Not authenticated');

    const supabase = await createClient();

    const { error } = await supabase
        .from('blocks')
        .insert({
            blocker_id: userId,
            blocked_id: targetId
        });

    if (error) {
        console.error('Error blocking user:', error);
        throw error;
    }

    return { success: true };
}

/**
 * Get list of users blocked by current user
 */
export async function getBlockedUsers(): Promise<string[]> {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('blocks')
        .select('blocked_id')
        .eq('blocker_id', userId);

    if (error) {
        console.error('Error fetching blocked users:', error);
        return [];
    }

    return data.map(b => b.blocked_id);
}
