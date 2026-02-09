'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser, useSession, useClerk } from '@clerk/nextjs';
import { getSupabaseClient } from '@/lib/supabase/client';
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
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
    const { session } = useSession();
    const { signOut: clerkSignOut } = useClerk();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Sync Clerk -> Supabase
    useEffect(() => {
        const syncUser = async () => {
            if (!isClerkLoaded) return;

            if (!clerkUser) {
                setProfile(null);
                setLoading(false);
                return;
            }

            try {
                // 1. Get JWT from Clerk for Supabase
                const token = await session?.getToken({ template: 'supabase' });
                if (!token) throw new Error('No Supabase Token');

                // 2. Initialize authenticated Supabase client
                const supabase = getSupabaseClient(token);

                // 3. Check if profile exists
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', clerkUser.id)
                    .single();

                if (existingProfile) {
                    setProfile(existingProfile);
                } else {
                    // 4. Create Profile (First Time Login)
                    const newProfile = {
                        id: clerkUser.id,
                        username: `user_${clerkUser.id.slice(-6)}`,
                        full_name: clerkUser.fullName || '',
                        avatar_url: clerkUser.imageUrl,
                        role: 'explorer', // Default role
                        created_at: new Date().toISOString(),
                    };

                    const { data: createdProfile, error } = await supabase
                        .from('profiles')
                        .insert(newProfile)
                        .select()
                        .single();

                    if (!error && createdProfile) {
                        setProfile(createdProfile);
                    }
                }
            } catch (err) {
                console.error('Auth Sync Error:', err);
            } finally {
                setLoading(false);
            }
        };

        syncUser();
    }, [clerkUser, isClerkLoaded, session]);

    const signOut = async () => {
        await clerkSignOut();
        setProfile(null);
        window.location.href = '/';
    };

    const refreshProfile = async () => {
        if (!clerkUser || !session) return;
        const token = await session.getToken({ template: 'supabase' });
        if (token) {
            const supabase = getSupabaseClient(token);
            const { data } = await supabase.from('profiles').select('*').eq('id', clerkUser.id).single();
            if (data) setProfile(data);
        }
    };

    const updateProfile = async (data: Partial<Profile>) => {
        if (!clerkUser || !session) return;
        const token = await session.getToken({ template: 'supabase' });
        if (token) {
            const supabase = getSupabaseClient(token);
            await supabase.from('profiles').update(data).eq('id', clerkUser.id);
            refreshProfile();
        }
    }

    return (
        <AuthContext.Provider value={{
            user: clerkUser,
            profile,
            loading: !isClerkLoaded || loading,
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
