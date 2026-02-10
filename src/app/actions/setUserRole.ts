'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function setUserRole(role: 'provider' | 'protege') {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = createAdminClient();

    // Auto-generate username from Clerk data
    const autoUsername = user.firstName
        ? `${user.firstName.toLowerCase()}${userId.slice(-4)}`
        : `user_${userId.slice(-6)}`;

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            role: role,
            username: autoUsername,
            full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
            avatar_url: user.imageUrl || null,
            lifestyle_tier: 'executive', // Default
            bio: '', // Empty default
        });

    if (error) {
        console.error('Failed to set role:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
