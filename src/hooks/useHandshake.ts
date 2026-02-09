
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export type HandshakeStatus = 'pending' | 'accepted' | 'denied' | 'none'

export interface Handshake {
    id: string
    sender_id: string
    receiver_id: string
    status: HandshakeStatus
    created_at: string
}

export const useHandshake = (targetUserId: string | null) => {
    const [status, setStatus] = useState<HandshakeStatus>('none')
    const [isLoading, setIsLoading] = useState(true)
    const [handshakeId, setHandshakeId] = useState<string | null>(null)
    const [isSender, setIsSender] = useState(false)
    const supabase = getSupabaseClient()

    useEffect(() => {
        if (!targetUserId) {
            setIsLoading(false)
            return
        }

        const fetchHandshake = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                // Check if I sent one
                const { data: sent, error: sentError } = await supabase
                    .from('handshakes')
                    .select('*')
                    .eq('sender_id', user.id)
                    .eq('receiver_id', targetUserId)
                    .single()

                // Check if I received one
                const { data: received, error: receivedError } = await supabase
                    .from('handshakes')
                    .select('*')
                    .eq('sender_id', targetUserId)
                    .eq('receiver_id', user.id)
                    .single()

                if (sent) {
                    setStatus(sent.status)
                    setHandshakeId(sent.id)
                    setIsSender(true)
                } else if (received) {
                    setStatus(received.status)
                    setHandshakeId(received.id)
                    setIsSender(false)
                } else {
                    setStatus('none')
                }
            } catch (error) {
                console.error('Error fetching handshake:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHandshake()

        // Subscribe to changes for this specific relationship
        // Note: detailed realtime filter might be complex, so relying on global listener or manual refresh often simpler for MVP
        // but the RealtimeEngine will handle global notifications. This hook needs local state update.

    }, [targetUserId, supabase])

    const requestAccess = async () => {
        if (!targetUserId) return
        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { data, error } = await supabase
                .from('handshakes')
                .insert({
                    sender_id: user.id,
                    receiver_id: targetUserId,
                    status: 'pending'
                })
                .select()
                .single()

            if (error) throw error

            setStatus('pending')
            setHandshakeId(data.id)
            setIsSender(true)
            toast.success('Access request sent')
        } catch (error) {
            console.error('Error sending request:', error)
            toast.error('Failed to send request')
        } finally {
            setIsLoading(false)
        }
    }

    const acceptRequest = async () => {
        if (!handshakeId) return
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from('handshakes')
                .update({ status: 'accepted' })
                .eq('id', handshakeId)

            if (error) throw error

            setStatus('accepted')
            toast.success('Access granted')
        } catch (error) {
            console.error('Error accepting request:', error)
            toast.error('Failed to accept request')
        } finally {
            setIsLoading(false)
        }
    }

    const denyRequest = async () => {
        if (!handshakeId) return
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from('handshakes')
                .update({ status: 'denied' })
                .eq('id', handshakeId)

            if (error) throw error

            setStatus('denied')
            toast.success('Access denied')
        } catch (error) {
            console.error('Error denying request:', error)
            toast.error('Failed to deny request')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        status,
        isLoading,
        isSender,
        requestAccess,
        acceptRequest,
        denyRequest
    }
}
