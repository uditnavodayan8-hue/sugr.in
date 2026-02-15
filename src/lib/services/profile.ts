"use server";

import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export interface ProfileData {
    role?: 'provider' | 'protege';
    name?: string;
    age?: number;
    gender?: string;
    city?: string;
    bio?: string;
    avatar_url?: string;
    photos?: string[];
    lifestyle_tier?: 'executive' | 'elite' | 'premium';
    lifestyle_expectation?: { min: number; max: number };
    age_preference?: { min: number; max: number };
    interests?: string[];
    is_verified?: boolean;
    latitude?: number;
    longitude?: number;
}

export interface Profile extends ProfileData {
    id: string;
    created_at: string;
    last_seen: string;
    sugr_index: number;
    distance_km?: number; // Added from RPC
}

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<Profile | null> {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

/**
 * Create or update user profile
 */
export async function upsertProfile(profileData: ProfileData): Promise<Profile | null> {
    const { userId } = await auth();
    if (!userId) throw new Error('Not authenticated');

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            ...profileData,
            last_seen: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting profile:', error);
        throw error;
    }

    return data;
}

/**
 * Update specific profile fields
 */
export async function updateProfile(updates: Partial<ProfileData>): Promise<Profile | null> {
    const { userId } = await auth();
    if (!userId) throw new Error('Not authenticated');

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }

    return data;
}

/**
 * Upload profile photo to Supabase Storage
 */
export async function uploadProfilePhoto(file: File, userId: string): Promise<string | null> {
    const supabase = await createClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading photo:', error);
        return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

    return publicUrl;
}

/**
 * Calculate Sugr Index (compatibility score)
 * Based on profile completeness and verification status
 */
export function calculateSugrIndex(profile: ProfileData): number {
    let score = 1;

    // Profile completeness (max +50)
    if (profile.role) score += 10;
    if (profile.name) score += 5;
    if (profile.age) score += 5;
    if (profile.city) score += 5;
    if (profile.bio && profile.bio.length > 50) score += 10;
    if (profile.photos && profile.photos.length >= 4) score += 15;

    // Verification (max +30)
    if (profile.is_verified) score += 30;

    // Premium tier (max +20)
    if (profile.lifestyle_tier === 'premium') score += 20;
    else if (profile.lifestyle_tier === 'elite') score += 10;

    return Math.min(score, 100); // Cap at 100
}

/**
 * Get profile by ID (for viewing other users)
 */
export async function getProfileById(profileId: string): Promise<Profile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

/**
 * Check if profile is complete (ready for discovery)
 */
export function isProfileComplete(profile: Profile | ProfileData): boolean {
    return !!(
        profile.role &&
        profile.name &&
        profile.age &&
        profile.city &&
        profile.bio &&
        profile.photos &&
        profile.photos.length >= 4
    );
}
