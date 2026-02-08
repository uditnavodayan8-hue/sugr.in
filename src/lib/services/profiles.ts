import { getSupabaseClient } from '../supabase/client';

import { ProfilePhoto } from './profilePhotos';

export interface Profile {
    id: string;
    role: 'provider' | 'protege';
    name: string;
    age: number;
    gender: string;
    city: string;
    bio: string;
    avatar_url: string | null;
    video_url: string | null;
    // Dossier Fields
    sugr_index: number; // 0-100
    lifestyle_tier: 'Minimalist' | 'Moderate' | 'High' | 'Ultra-High' | null;
    location_lat?: number;
    location_lng?: number;
    dist_meters?: number; // Distance from current user (in meters)
    is_verified_provider: boolean;

    verification_level: {
        phone: boolean;
        id: boolean;
        social: boolean;
        wealth: boolean;
    };
    trust_score: number;
    created_at: string;
    photos?: ProfilePhoto[];
}

export interface DiscoveryFilters {
    role?: 'Provider' | 'Protégé';
    minAge?: number;
    maxAge?: number;
    city?: string;
    lat?: number;
    lng?: number;
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
        .select('*, photos:profile_photos(*)')
        .eq('id', userId)
        .order('position', { foreignTable: 'profile_photos', ascending: true })
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // Row not found - this is expected for new users or if profile was deleted
            return null;
        }
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
    const { role, minAge = 18, maxAge = 99, city, lat, lng, limit = 20, offset = 0 } = filters;

    // IF Location is provided, use Geospatial Search (RPC)
    if (lat !== undefined && lng !== undefined) {
        const { data, error } = await supabase.rpc('search_users_nearby', {
            lat,
            long: lng,
            radius_meters: 500000, // 500km default for feed
        });

        if (error) {
            console.error('Error fetching geospatial profiles:', error);
            return [];
        }

        // Filter locally for now (RPC doesn't have all filters yet)
        // ideally RPC should accept filters, but for v1 this is fine
        let profiles = (data as Profile[]) || [];

        // Apply other filters locally
        profiles = profiles.filter(p => {
            if (p.id === currentUserId) return false;
            if (!p.avatar_url || !p.name) return false;
            if (p.age < minAge || p.age > maxAge) return false;
            if (role && p.role !== role) return false;
            if (city && p.city !== city) return false;
            return true;
        });

        return profiles.slice(offset, offset + limit);
    }

    // FALLBACK: Standard Query
    let query = supabase
        .from('profiles')
        .select('*, photos:profile_photos(*)')
        .neq('id', currentUserId)
        // Only show completed profiles (users who finished onboarding)
        .not('avatar_url', 'is', null)
        .not('name', 'is', null)
        .gte('age', minAge)
        .lte('age', maxAge)
        .range(offset, offset + limit - 1)
        .order('position', { foreignTable: 'profile_photos', ascending: true });

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
        .select('*, photos:profile_photos(*)')
        .eq('id', profileId)
        .order('position', { foreignTable: 'profile_photos', ascending: true })
        .single();

    if (error) {
        console.error('Error fetching profile by ID:', error);
        return null;
    }

    return data as Profile;
}

/**
 * Update user's location (Geo-Spatial)
 */
export async function updateUserLocation(lat: number, lng: number): Promise<void> {
    const { error } = await supabase.rpc('update_user_location', {
        lat,
        long: lng,
    });

    if (error) {
        console.error('Error updating location:', error);
    }
}

/**
 * Search users nearby (Geo-Spatial)
 */
export async function searchProfilesNearby(
    lat: number,
    lng: number,
    radiusMeters: number = 50000 // 50km
): Promise<Profile[]> {
    const { data, error } = await supabase.rpc('search_users_nearby', {
        lat,
        long: lng,
        radius_meters: radiusMeters,
    });

    if (error) {
        console.error('Error searching nearby users:', error);
        return [];
    }

    return (data as Profile[]) || [];
}
