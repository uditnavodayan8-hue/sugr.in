'use server';

import { createServerClient } from '@supabase/ssr';
import { getSupabaseClient } from '@/lib/supabase/client';
import { revalidatePath } from 'next/cache';

interface PostAdInput {
    content: string;
    tier: 'executive' | 'elite' | 'premium';
}

/**
 * Server Action to post a new ephemeral ad.
 * Ads expire after 24 hours automatically.
 */
export async function postAd(input: PostAdInput) {
    // Note: For server actions, we need to use a different approach
    // This is a simplified version - in production, use cookies-based server client
    const supabase = getSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    // Check if user already has an active ad
    const { data: existingAd } = await supabase
        .from('ads')
        .select('id')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .single();

    if (existingAd) {
        return { success: false, error: 'You already have an active broadcast' };
    }

    // Create the ad
    const { data, error } = await supabase
        .from('ads')
        .insert({
            user_id: user.id,
            content: input.content,
            tier: input.tier,
        })
        .select()
        .single();

    if (error) {
        console.error('Error posting ad:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, ad: data };
}

/**
 * Server Action to delete user's own ad.
 */
export async function deleteAd(adId: string) {
    const supabase = getSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId)
        .eq('user_id', user.id); // Ensure user owns the ad

    if (error) {
        console.error('Error deleting ad:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

/**
 * Server Action to respond to an access request.
 */
export async function respondToAccessRequest(
    requestId: string,
    status: 'granted' | 'denied'
) {
    const supabase = getSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('access_requests')
        .update({ status })
        .eq('id', requestId)
        .eq('target_id', user.id); // Ensure user is the target

    if (error) {
        console.error('Error updating request:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
