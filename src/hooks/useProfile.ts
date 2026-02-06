'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfile, updateProfile, Profile } from '@/lib/services/profiles';

export function useProfile() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        const loadProfile = async () => {
            try {
                setLoading(true);
                const data = await getProfile(user.id);
                setProfile(data);
            } catch (err) {
                console.error('Error loading profile:', err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user, authLoading]);

    const update = async (updates: Partial<Profile>): Promise<boolean> => {
        if (!user) return false;

        try {
            const updated = await updateProfile(user.id, updates);
            if (updated) {
                setProfile(updated);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error updating profile:', err);
            return false;
        }
    };

    return {
        user,
        profile,
        loading: loading || authLoading,
        error,
        updateProfile: update,
    };
}
