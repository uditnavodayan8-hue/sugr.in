import { getSupabaseClient } from '../supabase/client';
import { extendMatch } from './matches';

export interface Message {
    id: string;
    match_id: string;
    sender_id: string;
    content: string | null;
    media_url: string | null;
    is_one_time_view: boolean;
    type: 'text' | 'image' | 'video' | 'audio' | 'agreement' | 'vault_key';
    metadata: Record<string, any> | null;
    viewed_at: string | null;
    created_at: string;
}

const supabase = getSupabaseClient();

/**
 * Get all messages for a match
 */
export async function getMessages(matchId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return (data as Message[]) || [];
}

/**
 * Send a message (text, agreement, vault_key, etc.)
 */
export async function sendMessage(
    matchId: string,
    senderId: string,
    content: string,
    type: Message['type'] = 'text',
    metadata: Record<string, any> = {},
    isEphemeral: boolean = false
): Promise<Message | null> {
    const { data, error } = await supabase
        .from('messages')
        .insert({
            match_id: matchId,
            sender_id: senderId,
            content,
            type,
            metadata,
            is_one_time_view: isEphemeral,
        })
        .select()
        .single();

    if (error) {
        console.error('Error sending message:', error);
        return null;
    }

    // Extend match expiry
    await extendMatch(matchId);

    return data as Message;
}

/**
 * Send a media message
 */
export async function sendMediaMessage(
    matchId: string,
    senderId: string,
    mediaUrl: string,
    isOneTimeView: boolean = false,
    type: 'image' | 'video' | 'audio' = 'image'
): Promise<Message | null> {
    const { data, error } = await supabase
        .from('messages')
        .insert({
            match_id: matchId,
            sender_id: senderId,
            media_url: mediaUrl,
            type,
            is_one_time_view: isOneTimeView,
        })
        .select()
        .single();

    if (error) {
        console.error('Error sending media message:', error);
        return null;
    }

    // Extend match expiry
    await extendMatch(matchId);

    return data as Message;
}

/**
 * Mark a one-time-view message as viewed
 */
export async function markMessageViewed(messageId: string): Promise<boolean> {
    const { error } = await supabase
        .from('messages')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('is_one_time_view', true);

    if (error) {
        console.error('Error marking message as viewed:', error);
        return false;
    }

    return true;
}

/**
 * Subscribe to new messages for a match (for real-time updates)
 * Returns a cleanup function
 */
export function subscribeToMessages(
    matchId: string,
    onNewMessage: (message: Message) => void
): () => void {
    const channel = supabase
        .channel(`messages-${matchId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `match_id=eq.${matchId}`,
            },
            (payload: { new: Record<string, unknown> }) => {
                onNewMessage(payload.new as unknown as Message);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
