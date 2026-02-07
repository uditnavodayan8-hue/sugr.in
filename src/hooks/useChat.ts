'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMessages, sendMessage, subscribeToMessages, markMessageViewed, Message as DBMessage } from '@/lib/services/messages';

export interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    isMe: boolean;
    timestamp: string;
    avatar?: string;
    media_url?: string;
    is_one_time_view?: boolean;
    viewed_at?: string | null;
}

export function useChat(matchId: string, partnerName?: string, partnerAvatar?: string) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatMessage = useCallback((msg: DBMessage): ChatMessage => {
        const isMe = msg.sender_id === user?.id;
        return {
            id: msg.id,
            sender: isMe ? 'Me' : (partnerName || 'Partner'),
            content: msg.content || '',
            isMe,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }),
            avatar: isMe ? undefined : partnerAvatar,
            media_url: msg.media_url || undefined,
            is_one_time_view: msg.is_one_time_view,
            viewed_at: msg.viewed_at,
        };
    }, [user?.id, partnerName, partnerAvatar]);

    // Load initial messages
    useEffect(() => {
        if (!user || !matchId) {
            setLoading(false);
            return;
        }

        const loadMessages = async () => {
            try {
                setLoading(true);
                setError(null);
                const dbMessages = await getMessages(matchId);
                const formatted = dbMessages.map(formatMessage);
                setMessages(formatted);
            } catch (err) {
                console.error('Error loading messages:', err);
                setError('Failed to load messages');
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, [matchId, user, formatMessage]);

    // Subscribe to real-time messages
    useEffect(() => {
        if (!matchId) return;

        const unsubscribe = subscribeToMessages(matchId, (newMessage) => {
            const formatted = formatMessage(newMessage);
            setMessages(prev => {
                // Avoid duplicates
                if (prev.some(m => m.id === formatted.id)) return prev;
                return [...prev, formatted];
            });
        });

        return () => unsubscribe();
    }, [matchId, formatMessage]);

    // Send a message
    const send = async (text: string, isEphemeral: boolean = false): Promise<boolean> => {
        if (!user || !matchId || !text.trim()) return false;

        try {
            // Updated signature: matchId, senderId, content, type, metadata, isEphemeral
            const result = await sendMessage(matchId, user.id, text.trim(), 'text', {}, isEphemeral);
            return !!result;
        } catch (err) {
            console.error('Error sending message:', err);
            return false;
        }
    };

    const markViewed = async (messageId: string) => {
        try {
            await markMessageViewed(messageId);
            // Optimistic update
            setMessages(prev => prev.map(m =>
                m.id === messageId ? { ...m, viewed_at: new Date().toISOString() } : m
            ));
        } catch (err) {
            console.error('Error marking message as viewed:', err);
        }
    };

    return {
        messages,
        loading,
        error,
        sendMessage: send,
        markAsViewed: markViewed,
    };
}
