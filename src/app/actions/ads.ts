'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAd(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const content = formData.get('content') as string
    const mediaUrl = formData.get('media_url') as string
    const lat = formData.get('lat')
    const lng = formData.get('lng')

    if (!content && !mediaUrl) {
        return { error: 'Content or media required' }
    }

    const { error } = await supabase
        .from('ads')
        .insert({
            user_id: user.id,
            content,
            media_url: mediaUrl,
            location_lat: lat ? parseFloat(lat as string) : null,
            location_lng: lng ? parseFloat(lng as string) : null
        })

    if (error) {
        console.error("Create Ad SQL Error:", JSON.stringify(error, null, 2))
        return { error: `Database Error: ${error.message} (${error.code})` }
    }

    revalidatePath('/discovery')
    return { success: true }
}
