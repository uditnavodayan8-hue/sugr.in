import { getSupabaseClient } from '@/lib/supabase/client';

const supabase = getSupabaseClient();

export interface Post {
    id: string;
    user_id: string;
    type: 'photo' | 'vibe' | 'interest';
    media_url?: string;
    content?: string;
    created_at: string;
}

export async function getProfileFeed(userId: string): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching feed:', error.message, error.details, error.hint);
        return [];
    }

    return data || [];
}

export async function getDiscoveryFeed(currentUserId: string): Promise<any[]> {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles:user_id (
                id,
                name,
                avatar_url,
                role,
                is_verified_provider
            )
        `)
        .neq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching discovery feed:', error);
        return [];
    }

    return data || [];
}

export async function createPost(post: Omit<Post, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function uploadPostImage(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

    return data.publicUrl;
}
