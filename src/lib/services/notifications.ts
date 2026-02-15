import { createClient } from '@/lib/supabase/client';

export async function registerDevice(token: string, platform: 'web' | 'ios' | 'android' = 'web') {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase
        .from('devices')
        .upsert({
            user_id: user.id,
            fcm_token: token,
            platform,
            last_active: new Date().toISOString()
        }, {
            onConflict: 'user_id, fcm_token'
        });

    if (error) {
        console.error('Error registering device:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function unregisterDevice(token: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from('devices')
        .delete()
        .eq('fcm_token', token);

    if (error) return { success: false, error: error.message };
    return { success: true };
}
