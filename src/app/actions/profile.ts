'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: {
    role: string;
    username: string;
    lifestyle_tier: string;
    bio: string;
    name: string;
    age: number;
    city: string;
    avatar_url?: string;
}) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }

    const supabase = createAdminClient();

    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                role: data.role,
                username: data.username,
                lifestyle_tier: data.lifestyle_tier,
                bio: data.bio,
                name: data.name,
                age: data.age,
                city: data.city,
                avatar_url: data.avatar_url,
                is_verified: false, // Reset verification on update? Or keep as is.
                // Assuming photos array might be needed later, but for now avatar_url is primary
            })
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
