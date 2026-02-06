import { getSupabaseClient } from '../supabase/client';

export interface Profile {
    id: string;
    role: 'Provider' | 'Protégé';
    name: string;
    age: number;
    gender: string;
    city: string;
    bio: string;
    avatar_url: string | null;
    video_url: string | null;
    verification_level: {
        phone: boolean;
        id: boolean;
        social: boolean;
        wealth: boolean;
    };
    trust_score: number;
    created_at: string;
}

export interface DiscoveryFilters {
    role?: 'Provider' | 'Protégé';
    minAge?: number;
    maxAge?: number;
    city?: string;
    limit?: number;
    offset?: number;
}

const supabase = getSupabaseClient();

/**
 * Get the current user's profile
 */
export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data as Profile;
}

/**
 * Create a new profile for a user
 */
export async function createProfile(
    userId: string,
    profileData: Partial<Profile>
): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            ...profileData,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating profile:', error);
        return null;
    }

    return data as Profile;
}

/**
 * Update an existing profile
 */
export async function updateProfile(
    userId: string,
    updates: Partial<Profile>
): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }

    return data as Profile;
}

/**
 * Get profiles for discovery feed (excludes current user and already swiped)
 */
export async function getDiscoveryProfiles(
    currentUserId: string,
    filters: DiscoveryFilters = {}
): Promise<Profile[]> {
    const { role, minAge = 18, maxAge = 99, city, limit = 20, offset = 0 } = filters;

    let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUserId)
        // Only show completed profiles (users who finished onboarding)
        .not('avatar_url', 'is', null)
        .not('name', 'is', null)
        .gte('age', minAge)
        .lte('age', maxAge)
        .range(offset, offset + limit - 1);

    // Filter by role if specified
    if (role) {
        query = query.eq('role', role);
    }

    // Filter by city if specified
    if (city) {
        query = query.eq('city', city);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching discovery profiles:', error);
        return [];
    }

    return (data as Profile[]) || [];
}

/**
 * Get a single profile by ID (for viewing others' profiles)
 */
export async function getProfileById(profileId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

    if (error) {
        console.error('Error fetching profile by ID:', error);
        return null;
    }

    return data as Profile;
}
