'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';

interface Profile {
    id: string;
    full_name: string;
    avatar_url: string;
    role: 'provider' | 'protege' | null;
    lifestyle_tier: 'executive' | 'elite' | 'premium' | null;
    sugr_index: number;
    last_seen: string;
    is_verified: boolean;
    bio?: string;
}

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
    loading: boolean;
    refreshProfile: () => Promise<void>;
    clearNotifications: () => void;
}

const SugrContext = createContext<SugrContextType | null>(null);

const PRESENCE_INTERVAL = 60000; // 60 seconds

export function SugrProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [notifications, setNotifications] = useState<AccessRequest[]>([]);
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

    // Refresh profile data
    const refreshProfile = useCallback(async () => {
        if (!user) return;
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        if (data) setProfile(data);
    }, [user, supabase]);

    // Clear notifications
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    useEffect(() => {
        const initApp = async () => {
            setLoading(true);

            // Get current user
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);

            if (!currentUser) {
                setLoading(false);
                return;
            }

            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            setProfile(profileData);
            setLoading(false);

            // Real-time listener for incoming access requests
            const channel = supabase.channel(`user-${currentUser.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'access_requests',
                        filter: `target_id=eq.${currentUser.id}`
                    },
                    (payload: { new: Record<string, unknown> }) => {
                        setNotifications(prev => [payload.new as unknown as AccessRequest, ...prev]);
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'access_requests',
                        filter: `requester_id=eq.${currentUser.id}`
                    },
                    (payload: { new: Record<string, unknown> }) => {
                        // Notify when your request is granted/denied
                        const request = payload.new as unknown as AccessRequest;
                        if (request.status !== 'pending') {
                            setNotifications(prev => [request, ...prev]);
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        };

        initApp();

        // Auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event: string, session: Session | null) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    setProfile(data);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Presence ping interval
    useEffect(() => {
        if (!user) return;

        // Initial ping
        pingPresence();

        // Set up interval
        const interval = setInterval(pingPresence, PRESENCE_INTERVAL);

        // Ping on visibility change (when user returns to tab)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                pingPresence();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user, pingPresence]);

    return (
        <SugrContext.Provider value={{
            user,
            profile,
            notifications,
            unreadCount: notifications.length,
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
