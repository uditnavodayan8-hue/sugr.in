import { getSupabaseClient } from '../supabase/client';

export interface AccessRequest {
    id: string;
    requester_id: string;
    target_id: string;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    message?: string;
    created_at: string;
}

const supabase = getSupabaseClient();

/**
 * Send an Access Request (Handshake)
 */
export async function sendAccessRequest(
    requesterId: string,
    targetId: string,
    message?: string
): Promise<{ success: boolean; match?: boolean; error?: any }> {
    // 1. Check if the target has already requested access from us (Pending)
    const { data: incomingRequest } = await supabase
        .from('access_requests')
        .select('*')
        .eq('requester_id', targetId)
        .eq('target_id', requesterId)
        .eq('status', 'pending')
        .single();

    if (incomingRequest) {
        // IT'S A MATCH!
        // Update their request to 'accepted'
        const { error: updateError } = await supabase
            .from('access_requests')
            .update({ status: 'accepted' })
            .eq('id', incomingRequest.id);

        if (updateError) {
            console.error('Error accepting match:', updateError);
            return { success: false, error: updateError };
        }

        return { success: true, match: true };
    }

    // 2. Otherwise, create a new request
    const { error } = await supabase
        .from('access_requests')
        .insert({
            requester_id: requesterId,
            target_id: targetId,
            message: message,
            status: 'pending'
        });

    if (error) {
        // Handle duplicate requests gracefullly
        if (error.code === '23505') { // Unique violation
            return { success: false, error: 'Request already pending' };
        }
        console.error('Error sending access request:', error);
        return { success: false, error };
    }

    return { success: true, match: false };
}

/**
 * Check if Access works (Vault Unlocked)
 */
export async function checkAccessStatus(
    requesterId: string,
    targetId: string
): Promise<'none' | 'pending' | 'accepted' | 'rejected'> {
    // Check if I sent a request
    const { data: myRequest } = await supabase
        .from('access_requests')
        .select('status')
        .eq('requester_id', requesterId)
        .eq('target_id', targetId)
        .single();

    if (myRequest) return myRequest.status as any;

    // Check if they sent me a request (and I accepted it?) -> mutual access?
    // For now, let's assume access is directional or mutual. 
    // The SQL check_vault_access function handles mutual check.
    const { data: theirRequest } = await supabase
        .from('access_requests')
        .select('status')
        .eq('requester_id', targetId)
        .eq('target_id', requesterId)
        .single();

    if (theirRequest) return theirRequest.status as any;

    return 'none';
}

/**
 * Respond to an Access Request
 */
export async function respondToRequest(
    requestId: string,
    status: 'accepted' | 'rejected'
): Promise<boolean> {
    const { error } = await supabase
        .from('access_requests')
        .update({ status })
        .eq('id', requestId);

    return !error;
}
