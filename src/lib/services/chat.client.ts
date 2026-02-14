
import { createClient } from '@/lib/supabase/client';
import { type Message } from './chat';

/**
 * Subscribe to new messages in a match (for real-time updates)
 */
export function subscribeToMessages(
    matchId: string,
    callback: (message: Message) => void
) {
    const supabase = createClient();

    const channel = supabase
        .channel(`match:${matchId}`)
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
