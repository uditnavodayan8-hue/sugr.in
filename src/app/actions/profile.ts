'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: {
    role: string;
    username: string;
    lifestyle_tier: string;
    bio: string;
    avatar_url?: string;
    latitude?: number;
    longitude?: number;
}) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }

    const supabase = createAdminClient();

    try {
        const updateData: any = {
            role: data.role,
            username: data.username,
            lifestyle_tier: data.lifestyle_tier,
            bio: data.bio,
            name: data.name,
            age: data.age,
            city: data.city,
            avatar_url: data.avatar_url,
            is_verified: false,
        };

        if (data.latitude && data.longitude) {
            updateData.latitude = data.latitude;
            updateData.longitude = data.longitude;
            // PostGIS update (requires raw SQL or ensuring the column accepts string)
            // Supabase JS client doesn't support PostGIS types directly in .update() easily without casting
            // We'll rely on a trigger or just store lat/long for now as the RPC uses lat/long columns
        }

        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId);

        if (error) {
            console.error('Update Profile Error:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/dashboard');
        revalidatePath('/profile');
        return { success: true };
    } catch (err: any) {
        console.error('Unexpected Update Profile Error:', err);
        return { success: false, error: err.message || 'Unknown error' };
    }
}
