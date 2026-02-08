import { getSupabaseClient } from '../supabase/client';
import { Profile } from './profiles';

export interface Match {
    id: string; // The match ID (from matches table)
    partner: Profile;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    isLastMessageMine?: boolean;
}

const supabase = getSupabaseClient();

export async function getMatches(userId: string): Promise<Match[]> {
    if (!userId) return [];

    // Fetch from 'matches' table
    // We need to match where user_a = userId OR user_b = userId
    // And then join with profiles to get the OTHER user's details.

    // 1. Get all matches for this user
    const { data: matchesData, error } = await supabase
        .from('matches')
        .select(`
            id,
            user_a,
            user_b,
            status,
            created_at,
            updated_at
        `)
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching matches:', error);
        return [];
    }

    if (!matchesData || matchesData.length === 0) return [];

    // 2. Extract partner IDs
    const matchesWithPartnerIds = matchesData.map((match: any) => {
        const partnerId = match.user_a === userId ? match.user_b : match.user_a;
        return { ...match, partnerId };
    });

    const partnerIds = matchesWithPartnerIds.map((m: any) => m.partnerId);

    // 3. Fetch partner profiles
    const { data: partnersData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', partnerIds);

    if (profilesError) {
        console.error('Error fetching partner profiles:', profilesError);
        return [];
    }

    // 4. Combine data and fetch last messages
    const matches: Match[] = await Promise.all(matchesWithPartnerIds.map(async (match: any) => {
        const partner = partnersData.find((p: any) => p.id === match.partnerId);

        // Skip if partner profile not found
        if (!partner) return null;

        // Fetch last message
        const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('match_id', match.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        return {
            id: match.id,
            partner: partner,
            unreadCount: 0, // TODO: Calculate unread count
            lastMessage: lastMsg?.content || "Start a conversation",
            lastMessageTime: lastMsg?.created_at || match.updated_at || match.created_at,
            isLastMessageMine: lastMsg?.sender_id === userId
        };
    }));

    return matches.filter(Boolean) as Match[];
}
