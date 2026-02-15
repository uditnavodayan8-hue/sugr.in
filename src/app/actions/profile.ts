'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const updates = Object.fromEntries(formData.entries())

    // Ensure ID is present for Upsert
    const profileData = {
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()

    if (error) {
        console.error("Profile Upsert Error:", error)
        return { error: error.message }
    }

    revalidatePath('/profile')
    revalidatePath('/discovery')
    revalidatePath('/onboarding')

    return { success: true }
}
