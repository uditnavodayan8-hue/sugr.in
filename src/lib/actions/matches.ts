'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSwipe(targetId: string, action: 'like' | 'pass') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('swipes')
        .insert({
            actor_id: user.id,
            target_id: targetId,
            action
        })

    if (error) {
        console.error('Swipe Error:', error)
        return { error: error.message }
    }

    // If it's a like, check for match check
    if (action === 'like') {
        const { data: reciprocal } = await supabase
            .from('swipes')
            .select('*')
            .eq('actor_id', targetId)
            .eq('target_id', user.id)
            .eq('action', 'like')
            .single()

        if (reciprocal) {
            // Create Match (Sort IDs to ensure uniqueness)
            // Convention: smaller ID is user_a
            const userA = user.id < targetId ? user.id : targetId;
            const userB = user.id < targetId ? targetId : user.id;

            const { data: match, error: matchError } = await supabase
                .from('matches')
                .insert({
                    user_a: userA,
                    user_b: userB,
                    status: 'active'
                })
                .select()
                .single()

            if (matchError) {
                console.error('Match Creation Error:', matchError)
            }

            return { success: true, isMatch: true, matchId: match?.id }
        }
    }

    revalidatePath('/dashboard')
    return { success: true, isMatch: false }
}
