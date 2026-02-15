'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';
import { Profile } from '@/lib/services/profiles';
import { User } from '@supabase/supabase-js';

interface AccessRequest {
    id: string;
    requester_id: string;
    target_id: string;
    status: 'pending' | 'granted' | 'denied';
    created_at: string;
}

interface SugrContextType {
    user: User | null;
    profile: Profile | null;
    notifications: AccessRequest[];
    unreadCount: number;
    unreadMatches?: number;
    unreadMessages?: number;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    clearNotifications: () => void;
}

const SugrContext = createContext<SugrContextType | null>(null);

const PRESENCE_INTERVAL = 60000; // 60 seconds

export function SugrProvider({ children }: { children: ReactNode }) {
    const { user, profile, refreshProfile } = useAuth();
    const [notifications, setNotifications] = useState<AccessRequest[]>([]);
    const [unreadMatches, setUnreadMatches] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [loading, setLoading] = useState(true);

    const supabase = getSupabaseClient();

    // Ping presence - updates last_seen every 60s
    const pingPresence = useCallback(async () => {
        if (!user) return;
        await supabase
            .from('profiles')
            .update({ last_seen: new Date().toISOString() })
            .eq('id', user.id);
    }, [user, supabase]);

    // Clear notifications
    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadMatches(0); // Optional: clear on view
        setUnreadMessages(0);
    }, []);

    // Effect for Real-time Notifications & Presence
    useEffect(() => {
        let mounted = true;

        if (!user) {
            setNotifications([]);
            setUnreadMatches(0);
            setUnreadMessages(0);
            setLoading(false);
            return;
        }

        setLoading(true);
        if (mounted) pingPresence();

        // Real-time listener
        const channel = supabase.channel(`user-notifications-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'access_requests',
                    filter: `target_id=eq.${user.id}`
                },
                (payload: { new: Record<string, unknown> }) => {
                    if (mounted) {
                        setNotifications(prev => [payload.new as unknown as AccessRequest, ...prev]);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'access_requests',
                    filter: `requester_id=eq.${user.id}`
                },
                (payload: { new: Record<string, unknown> }) => {
                    if (!mounted) return;
                    // Notify when your request is granted/denied
                    const request = payload.new as unknown as AccessRequest;
                    if (request.status !== 'pending') {
                        setNotifications(prev => [request, ...prev]);
                    }
                }
            )
            // Listen for New Matches
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'matches'
                },
                (payload: { new: Record<string, unknown> }) => {
                    const match = payload.new as any;
                    if (match.user_a === user.id || match.user_b === user.id) {
                        if (mounted) setUnreadMatches(prev => prev + 1);
                    }
                }
            )
            // Listen for New Messages
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                },
                (payload: { new: Record<string, unknown> }) => {
                    const msg = payload.new as any;
                    // If I am NOT the sender, it's for me (assuming RLS allows me to receive it)
                    if (msg.sender_id !== user.id) {
                        if (mounted) setUnreadMessages(prev => prev + 1);
                    }
                }
            )
            .subscribe();

        // Presence Interval
        const interval = setInterval(() => {
            if (mounted) pingPresence();
        }, PRESENCE_INTERVAL);

        // Visibility Handler
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && mounted) {
                pingPresence();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        if (mounted) setLoading(false);

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user, supabase, pingPresence]);

    return (
        <SugrContext.Provider value={{
            user,
            profile,
            notifications,
            unreadCount: notifications.length, // Legacy
            unreadMatches,
            unreadMessages,
            loading,
            refreshProfile,
            clearNotifications,
        }}>
            {children}
        </SugrContext.Provider>
    );
}

export function useSugr() {
    const context = useContext(SugrContext);
    if (!context) {
        throw new Error('useSugr must be used within a SugrProvider');
    }
    return context;
}

