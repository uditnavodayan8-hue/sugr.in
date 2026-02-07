'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseTypingIndicatorReturn {
    isPartnerTyping: boolean;
    setTyping: (isTyping: boolean) => void;
}

export function useTypingIndicator(matchId: string | null, partnerId?: string | null): UseTypingIndicatorReturn {
    const { user } = useAuth();
    const supabase = getSupabaseClient();
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const channelRef = useRef<RealtimeChannel | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const partnerTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Subscribe to typing events via Realtime Broadcast
    useEffect(() => {
        if (!matchId || !user) return;

        const channel = supabase
            .channel(`typing-${matchId}`)
            .on('broadcast', { event: 'typing' }, (payload: { payload: { userId: string; isTyping: boolean } }) => {
                // Only show typing if it's from partner, not self
                if (payload.payload.userId !== user.id) {
                    setIsPartnerTyping(payload.payload.isTyping);

                    // Auto-clear typing after 3 seconds if no update
                    if (payload.payload.isTyping) {
                        if (partnerTypingTimeoutRef.current) {
                            clearTimeout(partnerTypingTimeoutRef.current);
                        }
                        partnerTypingTimeoutRef.current = setTimeout(() => {
                            setIsPartnerTyping(false);
                        }, 3000);
                    }
                }
            })
            .subscribe();

        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
            if (partnerTypingTimeoutRef.current) {
                clearTimeout(partnerTypingTimeoutRef.current);
            }
        };
    }, [matchId, user, supabase]);

    // Broadcast typing state
    const setTyping = useCallback(
        (isTyping: boolean) => {
            if (!channelRef.current || !user) return;

            channelRef.current.send({
                type: 'broadcast',
                event: 'typing',
                payload: {
                    userId: user.id,
                    isTyping,
                },
            });

            // Auto-stop typing after 3 seconds of no updates
            if (isTyping) {
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => {
                    channelRef.current?.send({
                        type: 'broadcast',
                        event: 'typing',
                        payload: {
                            userId: user?.id,
                            isTyping: false,
                        },
                    });
                }, 3000);
            }
        },
        [user]
    );

    return {
        isPartnerTyping,
        setTyping,
    };
}
