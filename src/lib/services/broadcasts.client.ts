
import { createClient } from '@/lib/supabase/client';
import { type Broadcast } from './broadcasts';

/**
 * Subscribe to new broadcasts (real-time)
 */
export function subscribeToBroadcasts(callback: (broadcast: Broadcast) => void) {
    const supabase = createClient();

    const channel = supabase
        .channel('broadcasts')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'broadcasts',
            },
            (payload) => {
                callback(payload.new as Broadcast);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
