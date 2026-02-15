'use server'

import { createClient } from '@/lib/supabase/server'
import { calculateSugrIndex, isProfileComplete } from '@/lib/utils/profile-utils'

export interface ProfileData {
    role?: 'provider' | 'protege'
    name?: string
    age?: number
    gender?: string
    city?: string
    bio?: string
    avatar_url?: string
    photos?: string[]
    lifestyle_tier?: 'executive' | 'elite' | 'premium'
    lifestyle_expectation?: { min: number; max: number }
    age_preference?: { min: number; max: number }
    interests?: string[]
    is_verified?: boolean
    latitude?: number
    longitude?: number
}

export interface Profile extends ProfileData {
    id: string
    created_at: string
    last_seen: string
    sugr_index: number
    distance_km?: number // Added from RPC
}

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<Profile | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return data
}

/**
 * Create or update user profile
 */
export async function upsertProfile(profileData: ProfileData): Promise<Profile | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            ...profileData,
            last_seen: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
        console.error('Error upserting profile:', error)
        throw error
    }

    return data
}

/**
 * Update specific profile fields
 */
export async function updateProfile(updates: Partial<ProfileData>): Promise<Profile | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

    if (error) {
        console.error('Error updating profile:', error)
        throw error
    }

    return data
}

/**
 * Upload profile photo to Supabase Storage
 */
export async function uploadProfilePhoto(file: File, userId: string): Promise<string | null> {
    const supabase = await createClient()

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        console.error('Error uploading photo:', error)
        return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path)

    return publicUrl
}

/**
 * Get profile by ID (for viewing other users)
 */
export async function getProfileById(profileId: string): Promise<Profile | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return data
}

// Re-export utilities so other files don't break if they imported from here (optional, but good practice)
export { calculateSugrIndex, isProfileComplete }
