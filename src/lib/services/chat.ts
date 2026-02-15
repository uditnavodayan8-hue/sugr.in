'use server'

import { createClient } from '@/lib/supabase/server'

export interface Message {
    id: string
    match_id: string
    sender_id: string
    content: string | null
    media_url: string | null
    is_one_time_view: boolean
    viewed_at: string | null
    created_at: string
}

/**
 * Get messages for a specific match
 */
export async function getMessages(matchId: string): Promise<Message[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // First verify user is part of this match
    const { data: match } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .single()

    if (!match) {
        console.error('User not authorized for this match')
        return []
    }

    // Fetch messages
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching messages:', error)
        return []
    }

    return data || []
}

/**
 * Send a message
 */
export async function sendMessage(
    matchId: string,
    content?: string,
    mediaUrl?: string,
    isOneTimeView: boolean = false
): Promise<Message | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    if (!content && !mediaUrl) {
        throw new Error('Message must have content or media')
    }

    // Verify user is part of this match
    const { data: match } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .eq('status', 'active')
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .single()

    if (!match) {
        throw new Error('Match not found or inactive')
    }

    // Insert message
    const { data, error } = await supabase
        .from('messages')
        .insert({
            match_id: matchId,
            sender_id: user.id,
            content,
            media_url: mediaUrl,
            is_one_time_view: isOneTimeView,
        })
        .select()
        .single()

    if (error) {
        console.error('Error sending message:', error)
        throw error
    }

    return data
}

/**
 * Mark message as viewed (for one-time view messages)
 */
export async function markMessageViewed(messageId: string): Promise<void> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase
        .from('messages')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', messageId)
        .neq('sender_id', user.id) // Only mark if not the sender
}

/**
 * Get all chats (matches with last message)
 */
export async function getChats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Fetch matches with profiles
    const { data: matches, error } = await supabase
        .from('matches')
        .select(`
            *,
            user_a_profile:profiles!matches_user_a_fkey(*),
            user_b_profile:profiles!matches_user_b_fkey(*),
            messages:messages(content, created_at, sender_id, viewed_at)
        `)
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching chats:', error)
        return []
    }

    // Process matches to format for chat list
    const chats = matches.map((match: any) => {
        // Determine the other user
        const otherUser = match.user_a === user.id ? match.user_b_profile : match.user_a_profile

        // Find last message (Supabase returns array even if we limit, but here we fetched all. optimization needed for prod)
        // Ideally we use .limit(1) in the join but Supabase join limits are tricky with multiple rows.
        // For MVP, handling in JS is acceptable.

        // The messages array from the join:
        // Note: 'messages' property might be an array or object depending on relationship. It's One-to-Many, so array.
        const msgs = (match.messages as any[]) || []
        msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        const lastMsg = msgs[0]

        return {
            id: match.id,
            partnerId: otherUser.id,
            name: otherUser.name || 'User',
            avatar: otherUser.avatar_url,
            lastMessage: lastMsg?.content || 'New Match!',
            time: lastMsg ? lastMsg.created_at : match.created_at,
            unread: lastMsg && lastMsg.sender_id !== user.id && !lastMsg.viewed_at,
            online: false // TODO: Real-time presence
        }
    })

    return chats.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime())
}
