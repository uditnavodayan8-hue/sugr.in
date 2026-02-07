'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

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
    read_at: string | null;
    created_at: string;
}

interface UseRealtimeMessagesReturn {
    messages: Message[];
    loading: boolean;
    error: string | null;
    sendMessage: (content: string, type?: Message['type'], metadata?: Record<string, any>) => Promise<boolean>;
    sendMediaMessage: (mediaUrl: string, isOneTimeView?: boolean) => Promise<boolean>;
    markAsRead: () => Promise<void>;
}

export function useRealtimeMessages(matchId: string | null): UseRealtimeMessagesReturn {
    const { user } = useAuth();
    const supabase = getSupabaseClient();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const channelRef = useRef<RealtimeChannel | null>(null);

    // Fetch initial messages
    useEffect(() => {
        if (!matchId || !user) {
            setLoading(false);
            return;
        }

        const fetchMessages = async () => {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('messages')
                .select('*')
                .eq('match_id', matchId)
                .order('created_at', { ascending: true });

            if (fetchError) {
                console.error('Error fetching messages:', fetchError);
                setError(fetchError.message);
            } else {
                setMessages(data as Message[]);
            }
            setLoading(false);
        };

        fetchMessages();
    }, [matchId, user, supabase]);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!matchId || !user) return;

        // Create channel for this match
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
                    const newMessage = payload.new as unknown as Message;
                    setMessages((prev) => {
                        // Avoid duplicates
                        if (prev.some((m) => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `match_id=eq.${matchId}`,
                },
                (payload: { new: Record<string, unknown> }) => {
                    const updatedMessage = payload.new as unknown as Message;
                    setMessages((prev) =>
                        prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
                    );
                }
            )
            .subscribe();

        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
        };
    }, [matchId, user, supabase]);

    // Send text/rich message
    const sendMessage = useCallback(
        async (content: string, type: Message['type'] = 'text', metadata: Record<string, any> = {}): Promise<boolean> => {
            if (!matchId || !user) return false;

            const { error: sendError } = await supabase.from('messages').insert({
                match_id: matchId,
                sender_id: user.id,
                content,
                type,
                metadata,
                is_one_time_view: false, // Default for text/rich messages
            });

            if (sendError) {
                console.error('Error sending message:', sendError);
                return false;
            }

            return true;
        },
        [matchId, user, supabase]
    );

    // Send media message
    const sendMediaMessage = useCallback(
        async (mediaUrl: string, isOneTimeView: boolean = false): Promise<boolean> => {
            if (!matchId || !user) return false;

            const { error: sendError } = await supabase.from('messages').insert({
                match_id: matchId,
                sender_id: user.id,
                media_url: mediaUrl,
                is_one_time_view: isOneTimeView,
            });

            if (sendError) {
                console.error('Error sending media message:', sendError);
                return false;
            }

            return true;
        },
        [matchId, user, supabase]
    );

    // Mark all unread messages as read
    const markAsRead = useCallback(async () => {
        if (!matchId || !user) return;

        await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('match_id', matchId)
            .neq('sender_id', user.id)
            .is('read_at', null);
    }, [matchId, user, supabase]);

    return {
        messages,
        loading,
        error,
        sendMessage,
        sendMediaMessage,
        markAsRead,
    };
}
