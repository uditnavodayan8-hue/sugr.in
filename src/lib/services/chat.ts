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
    const { userId } = auth();
    if (!userId) return [];

    const supabase = createClient();

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
    const { userId } = auth();
    if (!userId) throw new Error('Not authenticated');

    if (!content && !mediaUrl) {
        throw new Error('Message must have content or media');
    }

    const supabase = createClient();

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
    const { userId } = auth();
    if (!userId) return;

    const supabase = createClient();

    await supabase
        .from('messages')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', messageId)
        .neq('sender_id', userId); // Only mark if not the sender
}

/**
 * Subscribe to new messages in a match (for real-time updates)
 */
export function subscribeToMessages(
    matchId: string,
    callback: (message: Message) => void
) {
    const supabase = createClient();

    const channel = supabase
        .channel(`messages:${matchId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `match_id=eq.${matchId}`,
            },
            (payload) => {
                callback(payload.new as Message);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
