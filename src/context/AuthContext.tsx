'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getProfile, Profile } from '@/lib/services/profiles';

interface AuthContextType {
    user: any | null; // Clerk User
    profile: Profile | null; // Supabase Profile
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    // Setup for "Noir" feel - verify phone etc
    updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Create client once
    const supabase = createClient();

    const refreshProfile = async (uid?: string) => {
        const userId = uid || user?.id;
        if (!userId) return;

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) setProfile(data);
    };

    useEffect(() => {
        const initAuth = async () => {
            // Get initial session
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                await refreshProfile(session.user.id);
            }
            setLoading(false);

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    await refreshProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            });

            return () => subscription.unsubscribe();
        };

        initAuth();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        window.location.href = '/';
    };

    const updateProfile = async (data: Partial<Profile>) => {
        if (!user) return;
        const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
        if (!error) {
            await refreshProfile();
        } else {
            console.error("Profile update failed", error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            signOut,
            refreshProfile,
            updateProfile
        }}>
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
