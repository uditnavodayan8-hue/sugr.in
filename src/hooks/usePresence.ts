'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface PresenceState {
    status: 'online' | 'offline' | 'away';
    lastSeen: Date | null;
}

interface UsePresenceReturn {
    myStatus: 'online' | 'offline' | 'away';
    partnerPresence: PresenceState | null;
    setStatus: (status: 'online' | 'offline' | 'away') => Promise<void>;
}

export function usePresence(partnerId?: string | null): UsePresenceReturn {
    const { user } = useAuth();
    const supabase = getSupabaseClient();
    const [myStatus, setMyStatus] = useState<'online' | 'offline' | 'away'>('online');
    const [partnerPresence, setPartnerPresence] = useState<PresenceState | null>(null);
    const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize and maintain my presence
    useEffect(() => {
        if (!user) return;

        const initPresence = async () => {
            // Upsert my presence as online
            await supabase
                .from('user_presence')
                .upsert({
                    user_id: user.id,
                    status: 'online',
                    last_seen: new Date().toISOString(),
                });
            setMyStatus('online');
        };

        initPresence();

        // Heartbeat every 30 seconds
        heartbeatRef.current = setInterval(async () => {
            await supabase
                .from('user_presence')
                .update({
                    status: 'online',
                    last_seen: new Date().toISOString(),
                })
                .eq('user_id', user.id);
        }, 30000);

        // Set offline on tab close
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await supabase
                    .from('user_presence')
                    .update({ status: 'away' })
                    .eq('user_id', user.id);
                setMyStatus('away');
            } else {
                await supabase
                    .from('user_presence')
                    .update({
                        status: 'online',
                        last_seen: new Date().toISOString(),
                    })
                    .eq('user_id', user.id);
                setMyStatus('online');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Set offline on unmount
        return () => {
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            // Best effort to set offline
            supabase
                .from('user_presence')
                .update({ status: 'offline', last_seen: new Date().toISOString() })
                .eq('user_id', user.id);
        };
    }, [user, supabase]);

    // Subscribe to partner's presence
    useEffect(() => {
        if (!partnerId || !user) return;

        // Fetch initial presence
        const fetchPartnerPresence = async () => {
            const { data } = await supabase
                .from('user_presence')
                .select('status, last_seen')
                .eq('user_id', partnerId)
                .single();

            if (data) {
                setPartnerPresence({
                    status: data.status as 'online' | 'offline' | 'away',
                    lastSeen: data.last_seen ? new Date(data.last_seen) : null,
                });
            }
        };

        fetchPartnerPresence();

        // Subscribe to changes
        const channel = supabase
            .channel(`presence-${partnerId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_presence',
                    filter: `user_id=eq.${partnerId}`,
                },
                (payload: { new: { status: string; last_seen: string | null } }) => {
                    const data = payload.new;
                    setPartnerPresence({
                        status: data.status as 'online' | 'offline' | 'away',
                        lastSeen: data.last_seen ? new Date(data.last_seen) : null,
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partnerId, user, supabase]);

    // Set status manually
    const setStatus = useCallback(
        async (status: 'online' | 'offline' | 'away') => {
            if (!user) return;

            await supabase
                .from('user_presence')
                .update({
                    status,
                    last_seen: new Date().toISOString(),
                })
                .eq('user_id', user.id);

            setMyStatus(status);
        },
        [user, supabase]
    );

    return {
        myStatus,
        partnerPresence,
        setStatus,
    };
}
