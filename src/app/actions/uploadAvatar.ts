'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function uploadAvatar(formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }

    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file provided');
    }

    const supabase = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    // 1. Upload file (Admin, bypass RLS)
    // Note: We need to convert File to ArrayBuffer for Supabase Admin upload in Node env
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, buffer, {
            contentType: file.type,
            upsert: true
        });

    if (uploadError) {
        console.error('Upload Error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    // 3. Update Profile
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

    if (updateError) {
        throw new Error(`Profile update failed: ${updateError.message}`);
    }

    revalidatePath('/dashboard');
    return { success: true, publicUrl };
}
