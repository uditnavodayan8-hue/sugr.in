'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        // 1. Upload file
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return { success: false, error: `Upload failed: ${uploadError.message}` };
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        // 3. Update Profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);

        if (updateError) {
            console.error('Profile update failed:', updateError);
            return { success: false, error: `Profile update failed: ${updateError.message}` };
        }

        revalidatePath('/dashboard');
        return { success: true, publicUrl };
    } catch (err: any) {
        console.error('Unexpected upload error:', err);
        return { success: false, error: err.message || 'Unexpected server error' };
    }
}
