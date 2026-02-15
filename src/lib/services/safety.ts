'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Report a user for inappropriate behavior
 */
export async function reportUser(targetId: string, reason: string, details?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('reports')
        .insert({
            reporter_id: user.id,
            target_id: targetId,
            reason,
            details,
            status: 'pending'
        })

    if (error) {
        console.error('Error reporting user:', error)
        throw error
    }

    return { success: true }
}

/**
 * Block a user to prevent further interaction
 */
export async function blockUser(targetId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('blocks')
        .insert({
            blocker_id: user.id,
            blocked_id: targetId
        })

    if (error) {
        console.error('Error blocking user:', error)
        throw error
    }

    return { success: true }
}

/**
 * Get list of users blocked by current user
 */
export async function getBlockedUsers(): Promise<string[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('blocks')
        .select('blocked_id')
        .eq('blocker_id', user.id)

    if (error) {
        console.error('Error fetching blocked users:', error)
        return []
    }

    return data.map(b => b.blocked_id)
}
