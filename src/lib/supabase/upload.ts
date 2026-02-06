import { getSupabaseClient } from './client';

export type UploadBucket = 'avatars' | 'verification' | 'vault';

export async function uploadFile(
    file: File,
    bucket: UploadBucket,
    path: string
): Promise<string> {
    const supabase = getSupabaseClient();

    try {
        // Get current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
            console.error('Session Error:', sessionError);
            throw new Error('Not authenticated - No active session');
        }

        const user = session.user;
        const fileExt = file.name.split('.').pop();
        const filePath = `${path}.${fileExt}`;

        // Upload file - use user's folder structure for ownership
        console.log(`[Upload] Starting upload to ${bucket}: ${filePath}`);
        console.log(`[Upload] User ID: ${user.id}`);
        console.log(`[Upload] Auth Header Present:`, !!session.access_token);

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                upsert: true,
                cacheControl: '3600'
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
        }

        // Get URL based on bucket type
        if (bucket === 'avatars') {
            // Public bucket - return public URL
            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            return data.publicUrl;
        } else {
            // Private buckets - return signed URL for preview
            const { data, error: signedUrlError } = await supabase.storage
                .from(bucket)
                .createSignedUrl(filePath, 3600); // 1 hour expiry

            if (signedUrlError || !data?.signedUrl) {
                console.error('Signed URL error:', signedUrlError);
                // Fallback: return the path for later retrieval
                return filePath;
            }

            return data.signedUrl;
        }
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}
