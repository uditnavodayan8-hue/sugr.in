import { getSupabaseClient } from '../supabase/client';

export type SubscriptionTier = 'free' | 'gold' | 'black';

export interface Subscription {
    user_id: string;
    tier: SubscriptionTier;
    status: 'active' | 'canceled' | 'expired';
    expires_at: string | null;
}

const supabase = getSupabaseClient();

export async function getSubscription(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        // If no record, default to free implementation logic on caller side or return mock
        return {
            user_id: userId,
            tier: 'free',
            status: 'active',
            expires_at: null
        };
    }

    return data as Subscription;
}

export async function checkFeatureAccess(userId: string, feature: 'unlimited_swipes' | 'see_likes' | 'travel_mode'): Promise<boolean> {
    const sub = await getSubscription(userId);
    if (!sub) return false;

    if (sub.tier === 'black') return true; // Black tier has everything

    switch (feature) {
        case 'unlimited_swipes':
            return sub.tier === 'gold';
        case 'see_likes':
            return sub.tier === 'gold';
        case 'travel_mode':
            return sub.tier === 'gold';
        default:
            return false;
    }
}
