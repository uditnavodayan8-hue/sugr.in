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
