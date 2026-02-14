"use server";

import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export interface Broadcast {
    id: string;
    user_id: string;
    content: string;
    likes_count: number;
    created_at: string;
    profile?: {
        name: string;
        avatar_url: string;
        lifestyle_tier?: string;
    };
}

/**
 * Create a broadcast post
 */
export async function createBroadcast(content: string): Promise<Broadcast | null> {
    const { userId } = await auth();
    if (!userId) throw new Error('Not authenticated');

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('broadcasts')
        .insert({
            user_id: userId,
            content,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating broadcast:', error);
        throw error;
    }

    return data;
}

/**
 * Get broadcast feed (all users)
 */
export async function getBroadcastFeed(limit: number = 50): Promise<Broadcast[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('broadcasts')
        .select(`
      *,
      profile:profiles(name, avatar_url, lifestyle_tier)
    `)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching broadcasts:', error);
        return [];
    }

    return data || [];
}

/**
 * Delete a broadcast
 */
export async function deleteBroadcast(broadcastId: string): Promise<void> {
    const { userId } = await auth();
    if (!userId) throw new Error('Not authenticated');

    const supabase = await createClient();

    const { error } = await supabase
        .from('broadcasts')
        .delete()
        .eq('id', broadcastId)
        .eq('user_id', userId); // Ensure only owner can delete

    if (error) {
        console.error('Error deleting broadcast:', error);
        throw error;
    }
}
