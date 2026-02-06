'use client';
import { getSupabaseClient } from '../supabase/client';
import { uploadFile } from '../supabase/upload';

export interface ProfilePhoto {
    id: string;
    profile_id: string;
    url: string;
    position: number;
    is_primary: boolean;
    created_at: string;
}

const supabase = getSupabaseClient();

/**
 * Get all photos for a profile, ordered by position
 */
export async function getProfilePhotos(profileId: string): Promise<ProfilePhoto[]> {
    const { data, error } = await supabase
        .from('profile_photos')
        .select('*')
        .eq('profile_id', profileId)
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching profile photos:', error);
        return [];
    }

    return (data as ProfilePhoto[]) || [];
}

/**
 * Upload a new profile photo
 */
export async function uploadProfilePhoto(
    userId: string,
    file: File,
    position: number = 0
): Promise<ProfilePhoto | null> {
    try {
        // Upload the file to storage
        const url = await uploadFile(file, 'avatars', `${userId}/gallery-${Date.now()}`);

        // Insert record into profile_photos table
        const { data, error } = await supabase
            .from('profile_photos')
            .insert({
                profile_id: userId,
                url,
                position,
                is_primary: position === 0,
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving profile photo:', error);
            return null;
        }

        return data as ProfilePhoto;
    } catch (err) {
        console.error('Error uploading profile photo:', err);
        return null;
    }
}

/**
 * Set a photo as primary (main profile photo)
 */
export async function setPhotoPrimary(
    userId: string,
    photoId: string
): Promise<boolean> {
    // First, unset all other primaries
    await supabase
        .from('profile_photos')
        .update({ is_primary: false })
        .eq('profile_id', userId);

    // Set the new primary
    const { error } = await supabase
        .from('profile_photos')
        .update({ is_primary: true })
        .eq('id', photoId);

    if (error) {
        console.error('Error setting primary photo:', error);
        return false;
    }

    return true;
}

/**
 * Delete a profile photo
 */
export async function deleteProfilePhoto(photoId: string): Promise<boolean> {
    const { error } = await supabase
        .from('profile_photos')
        .delete()
        .eq('id', photoId);

    if (error) {
        console.error('Error deleting profile photo:', error);
        return false;
    }

    return true;
}

/**
 * Reorder photos by updating positions
 */
export async function reorderProfilePhotos(
    userId: string,
    photoIds: string[]
): Promise<boolean> {
    try {
        // Update each photo with its new position
        const updates = photoIds.map((id, index) =>
            supabase
                .from('profile_photos')
                .update({ position: index, is_primary: index === 0 })
                .eq('id', id)
                .eq('profile_id', userId)
        );

        await Promise.all(updates);
        return true;
    } catch (err) {
        console.error('Error reordering photos:', err);
        return false;
    }
}
