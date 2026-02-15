import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client' // Use the client-side helper
import { RealtimeChannel } from '@supabase/supabase-js'

interface PresenceState {
    lastSeen: Date | null
    isOnline: boolean
}

export function usePresence(partnerId: string | null) {
    const [presence, setPresence] = useState<PresenceState>({
        lastSeen: null,
        isOnline: false
    })

    const supabase = getSupabaseClient()

    useEffect(() => {
        if (!partnerId) return

        // Initial fetch
        const fetchInitialPresence = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('last_seen')
                .eq('id', partnerId)
                .single()

            if (data?.last_seen) {
                setPresence(prev => ({
                    ...prev,
                    lastSeen: new Date(data.last_seen)
                }))
            }
        }

        fetchInitialPresence()

        // Realtime subscription
        const channel = supabase
            .channel(`presence-${partnerId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${partnerId}`
                },
                (payload: any) => {
                    const newProfile = payload.new
                    if (newProfile?.last_seen) {
                        setPresence({
                            lastSeen: new Date(newProfile.last_seen),
                            isOnline: true // Simplified logic
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [partnerId, supabase])

    return presence
}
