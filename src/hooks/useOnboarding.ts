'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/upload';

export interface OnboardingData {
    // Step 1: Identity
    name: string;
    gender: string;
    // Step 2: Role
    role: 'Provider' | 'Protégé' | '';
    // Step 3: Vitals
    age: number | null;
    city: string;
    bio: string;
    // Step 4: Arrangement
    tags: string[];
    allowance: string;
    lifestyle_tier: string;
    // Step 5: Vetting
    avatarUrl: string;
    idDocUrl: string;
    faceImageUrl: string;
    secretAlbum: string[];
}

const initialData: OnboardingData = {
    name: '',
    gender: '',
    role: '',
    age: null,
    city: '',
    bio: '',
    tags: [],
    allowance: '',
    lifestyle_tier: '',
    avatarUrl: '',
    idDocUrl: '',
    faceImageUrl: '',
    secretAlbum: [],
};

export function useOnboarding() {
    const { user } = useAuth();
    const [data, setData] = useState<OnboardingData>(initialData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = getSupabaseClient();

    // Load existing profile data on mount
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const loadExistingData = async () => {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                setData({
                    name: profile.name || '',
                    gender: profile.gender || '',
                    role: profile.role || '',
                    age: profile.age || null,
                    city: profile.city || '',
                    bio: profile.bio || '',
                    tags: [], // Not in profiles table yet
                    allowance: '', // Not in profiles table yet
                    lifestyle_tier: profile.lifestyle_tier || '',
                    avatarUrl: profile.avatar_url || '',
                    idDocUrl: '',
                    faceImageUrl: '',
                    secretAlbum: [],
                });
            }
            setLoading(false);
        };

        loadExistingData();
    }, [user, supabase]);

    // Update a field
    const updateData = (updates: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    // Save current step data to Supabase
    const saveStepData = async (stepData: Partial<OnboardingData>) => {
        if (!user) return false;
        setSaving(true);

        try {
            // First update local state
            const newData = { ...data, ...stepData };
            setData(newData);

            // Then sync to Supabase profile
            const profileUpdate: Record<string, any> = {};

            if (stepData.name !== undefined) profileUpdate.name = stepData.name;
            if (stepData.gender !== undefined) profileUpdate.gender = stepData.gender;
            if (stepData.role !== undefined) profileUpdate.role = stepData.role;
            if (stepData.age !== undefined) profileUpdate.age = stepData.age;
            if (stepData.city !== undefined) profileUpdate.city = stepData.city;
            if (stepData.bio !== undefined) profileUpdate.bio = stepData.bio;
            if (stepData.avatarUrl !== undefined) profileUpdate.avatar_url = stepData.avatarUrl;
            if (stepData.lifestyle_tier !== undefined) profileUpdate.lifestyle_tier = stepData.lifestyle_tier;

            // Upsert profile (create if not exists, update if exists)
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...profileUpdate,
                });

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error saving step data:', err);
            return false;
        } finally {
            setSaving(false);
        }
    };

    // Upload avatar and update state
    const uploadAvatar = async (file: File): Promise<string | null> => {
        if (!user) return null;
        try {
            const url = await uploadFile(file, 'avatars', user.id);
            updateData({ avatarUrl: url });
            return url;
        } catch (err) {
            console.error('Avatar upload failed:', err);
            return null;
        }
    };

    // Upload verification document
    const uploadVerificationDoc = async (file: File): Promise<string | null> => {
        if (!user) return null;
        try {
            const url = await uploadFile(file, 'verification', `${user.id}/id`);
            updateData({ idDocUrl: url });
            return url;
        } catch (err) {
            console.error('ID upload failed:', err);
            return null;
        }
    };

    // Complete onboarding (final save)
    const completeOnboarding = async (): Promise<boolean> => {
        if (!user) return false;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    name: data.name,
                    gender: data.gender,
                    role: data.role,
                    age: data.age,
                    city: data.city,
                    bio: data.bio,
                    lifestyle_tier: data.lifestyle_tier,
                    avatar_url: data.avatarUrl,
                })
                .eq('id', user.id);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error completing onboarding:', err);
            return false;
        }
    };

    return {
        data,
        loading,
        saving,
        updateData,
        saveStepData,
        uploadAvatar,
        uploadVerificationDoc,
        completeOnboarding,
    };
}
