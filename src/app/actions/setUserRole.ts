'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setUserRole(role: 'provider' | 'protege') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id)

    if (error) {
        console.error('Error setting role:', error)
        throw new Error('Failed to set role')
    }

    revalidatePath('/onboarding')
    revalidatePath('/dashboard')

    return { success: true }
}
