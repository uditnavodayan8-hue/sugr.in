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
    const matchesWithPartnerIds = matchesData.map((match: {
        id: string;
        user_a: string;
        user_b: string;
        status: string;
        created_at: string;
        updated_at: string;
    }) => {
        const partnerId = match.user_a === userId ? match.user_b : match.user_a;
        return { ...match, partnerId };
    });

    const partnerIds = matchesWithPartnerIds.map((m: { partnerId: string }) => m.partnerId);

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
    const matches = await Promise.all(matchesWithPartnerIds.map(async (match: { id: string, partnerId: string, created_at: string }) => {
        const partner = partnersData?.find((p: Profile) => p.id === match.partnerId);

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

        const matchResult: Match = {
            id: match.id,
            partner: partner as Profile,
            unreadCount: 0, // TODO: Calculate unread count
            lastMessage: lastMsg?.content || undefined, // undefined indicates new match
            lastMessageTime: lastMsg?.created_at || match.created_at, // Use created_at if no messages
            isLastMessageMine: lastMsg?.sender_id === userId
        };
        return matchResult;
    }));

    return matches.filter((m): m is Match => m !== null);
}

export async function getSwipedProfileIds(userId: string): Promise<string[]> {
    if (!userId) return [];

    const { data: requests, error } = await supabase
        .from('access_requests')
        .select('requester_id, target_id')
        .or(`requester_id.eq.${userId},target_id.eq.${userId}`);

    if (error) {
        console.error('Error fetching interactions:', error);
        return [];
    }

    const interactedIds = new Set<string>();
    requests?.forEach((req: { requester_id: string; target_id: string }) => {
        if (req.requester_id === userId) interactedIds.add(req.target_id);
        if (req.target_id === userId) interactedIds.add(req.requester_id);
    });

    return Array.from(interactedIds);
}

export async function extendMatch(matchId: string): Promise<boolean> {
    const { error } = await supabase
        .from('matches')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', matchId);

    if (error) {
        console.error('Error extending match:', error);
        return false;
    }

    return true;
}
