import { Profile, ProfileData } from '@/lib/services/profile';

/**
 * Calculate Sugr Index (compatibility score)
 * Based on profile completeness and verification status
 */
export function calculateSugrIndex(profile: ProfileData): number {
    let score = 1

    // Profile completeness (max +50)
    if (profile.role) score += 10
    if (profile.name) score += 5
    if (profile.age) score += 5
    if (profile.city) score += 5
    if (profile.bio && profile.bio.length > 50) score += 10
    if (profile.photos && profile.photos.length >= 4) score += 15

    // Verification (max +30)
    if (profile.is_verified) score += 30

    // Premium tier (max +20)
    if (profile.lifestyle_tier === 'premium') score += 20
    else if (profile.lifestyle_tier === 'elite') score += 10

    return Math.min(score, 100) // Cap at 100
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
    )
}
