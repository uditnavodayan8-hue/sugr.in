'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';

import { getProfile, Profile } from '@/lib/services/profiles';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = getSupabaseClient();

    useEffect(() => {
        let mounted = true;

        const initSession = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (initialSession) {
                    setSession(initialSession);
                    setUser(initialSession.user);

                    if (initialSession.user) {
                        const profileData = await getProfile(initialSession.user.id);
                        if (mounted) setProfile(profileData);
                    }
                }
            } catch (error: any) {
                if (error.name === 'AbortError') return;
                console.error("Auth initialization error:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event: AuthChangeEvent, newSession: Session | null) => {
                if (!mounted) return;

                setSession(newSession);
                setUser(newSession?.user ?? null);

                if (newSession?.user) {
                    const profileData = await getProfile(newSession.user.id);
                    if (mounted) setProfile(profileData);
                } else {
                    if (mounted) setProfile(null);
                }

                if (mounted) setLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const refreshProfile = async () => {
        if (user) {
            const profileData = await getProfile(user.id);
            setProfile(profileData);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, session, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
