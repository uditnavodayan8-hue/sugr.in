'use client'

import { useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function RealtimeEngine() {
    const supabase = getSupabaseClient()
    const router = useRouter()

    useEffect(() => {
        const channel = supabase
            .channel('realtime_engine')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'matches'
                },
                async (payload: any) => {
                    const { data: { user } } = await supabase.auth.getUser()
                    if (!user) return

                    if (payload.new.user_a === user.id || payload.new.user_b === user.id) {
                        toast.success("It's a Match! ❤️", {
                            description: "You have a new connection.",
                            action: {
                                label: 'Chat',
                                onClick: () => router.push('/chat')
                            }
                        })
                        if (navigator.vibrate) navigator.vibrate([100, 50, 100])
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'handshakes'
                },
                async (payload: any) => {
                    const { data: { user } } = await supabase.auth.getUser()
                    if (!user) return

                    // Handle "Incoming Request" (INSERT where receiver_id == me)
                    if (payload.eventType === 'INSERT' && payload.new.receiver_id === user.id) {
                        toast('New Access Request', {
                            description: 'Someone wants to view your dossier.',
                            action: {
                                label: 'View',
                                onClick: () => router.push('/dashboard') // or notifications page
                            },
                        })
                        // Haptic if available (mobile)
                        if (navigator.vibrate) navigator.vibrate(200)
                    }

                    // Handle "Request Accepted" (UPDATE where sender_id == me AND status becomes accepted)
                    if (payload.eventType === 'UPDATE' && payload.new.sender_id === user.id) {
                        if (payload.new.status === 'accepted') {
                            toast.success('Access Granted', {
                                description: 'You have been granted access to a private dossier.',
                            })
                            if (navigator.vibrate) navigator.vibrate([100, 50, 100])
                        } else if (payload.new.status === 'denied') {
                            toast.error('Access Denied', {
                                description: 'Your request was declined.',
                            })
                        }
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    return null // This component is headless
}
