import { getSupabaseClient } from '../supabase/client';

export interface Preferences {
    discovery_role?: 'Provider' | 'Companion' | 'Both';
    discovery_min_age?: number;
    discovery_max_age?: number;
    discovery_city?: string;
    notifications_enabled?: boolean;
    privacy_hide_online?: boolean;
    privacy_hide_distance?: boolean;
}

const supabase = getSupabaseClient();
const PREFERENCES_KEY = 'sugr_preferences';

/**
 * Get user preferences from profile metadata
 */
export async function getPreferences(userId: string): Promise<Preferences> {
    // First try local storage for quick access
    const cached = localStorage.getItem(PREFERENCES_KEY);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch {
            // Invalid cache, continue
        }
    }

    // Fetch from profile
    const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single();

    if (error || !data?.preferences) {
        return {};
    }

    // Cache locally
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(data.preferences));

    return data.preferences as Preferences;
}

/**
 * Save user preferences
 */
export async function savePreferences(userId: string, preferences: Preferences): Promise<boolean> {
    const { error } = await supabase
        .from('profiles')
        .update({ preferences })
        .eq('id', userId);

    if (error) {
        console.error('Error saving preferences:', error);
        return false;
    }

    // Update cache
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));

    return true;
}

/**
 * Merge new preferences with existing ones
 */
export async function updatePreferences(userId: string, updates: Partial<Preferences>): Promise<boolean> {
    const current = await getPreferences(userId);
    const merged = { ...current, ...updates };
    return savePreferences(userId, merged);
}

/**
 * Clear local preferences cache
 */
export function clearPreferencesCache(): void {
    localStorage.removeItem(PREFERENCES_KEY);
}
