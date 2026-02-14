"use server";

import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export interface Message {
    id: string;
    match_id: string;
    sender_id: string;
    content: string | null;
    media_url: string | null;
    is_one_time_view: boolean;
    viewed_at: string | null;
    created_at: string;
}

/**
 * Get messages for a specific match
 */
export async function getMessages(matchId: string): Promise<Message[]> {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = await createClient();

    // First verify user is part of this match
    const { data: match } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .single();

    if (!match) {
        console.error('User not authorized for this match');
        return [];
    }

    // Fetch messages
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return data || [];
}

/**
 * Send a message
 */
export async function sendMessage(
    matchId: string,
    content?: string,
    mediaUrl?: string,
    isOneTimeView: boolean = false
): Promise<Message | null> {
    const { userId } = await auth();
    if (!userId) throw new Error('Not authenticated');

    if (!content && !mediaUrl) {
        throw new Error('Message must have content or media');
    }

    const supabase = await createClient();

    // Verify user is part of this match
    const { data: match } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .eq('status', 'active')
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .single();

    if (!match) {
        throw new Error('Match not found or inactive');
    }

    // Insert message
    const { data, error } = await supabase
        .from('messages')
        .insert({
            match_id: matchId,
            sender_id: userId,
            content,
            media_url: mediaUrl,
            is_one_time_view: isOneTimeView,
        })
        .select()
        .single();

    if (error) {
        console.error('Error sending message:', error);
        throw error;
    }

    return data;
}

/**
 * Mark message as viewed (for one-time view messages)
 */
export async function markMessageViewed(messageId: string): Promise<void> {
    const { userId } = await auth();
    if (!userId) return;

    const supabase = await createClient();

    await supabase
        .from('messages')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', messageId)
        .neq('sender_id', userId); // Only mark if not the sender
}

/**
 * Get all chats (matches with last message)
 */
export async function getChats() {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = await createClient();

    // Fetch matches with profiles
    const { data: matches, error } = await supabase
        .from('matches')
        .select(`
            *,
            user_a_profile:profiles!matches_user_a_fkey(*),
            user_b_profile:profiles!matches_user_b_fkey(*),
            messages:messages(content, created_at, sender_id, viewed_at)
        `)
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching chats:', error);
        return [];
    }

    // Process matches to format for chat list
    const chats = matches.map(match => {
        // Determine the other user
        const otherUser = match.user_a === userId ? match.user_b_profile : match.user_a_profile;

        // Find last message (Supabase returns array even if we limit, but here we fetched all. optimization needed for prod)
        // Actually, let's sort messages in JS since we fetched them. 
        // Ideally we use .limit(1) in the join but Supabase join limits are tricky with multiple rows.
        // For MVP, handling in JS is acceptable.

        // The messages array from the join:
        // Note: 'messages' property might be an array or object depending on relationship. It's One-to-Many, so array.
        const msgs = (match.messages as any[]) || [];
        msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const lastMsg = msgs[0];

        return {
            id: match.id,
            partnerId: otherUser.id,
            name: otherUser.name || 'User',
            avatar: otherUser.avatar_url,
            lastMessage: lastMsg?.content || 'New Match!',
            time: lastMsg ? lastMsg.created_at : match.created_at,
            unread: lastMsg && lastMsg.sender_id !== userId && !lastMsg.viewed_at,
            online: false // TODO: Real-time presence
        };
    });

    return chats.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

