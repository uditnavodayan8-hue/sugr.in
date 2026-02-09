'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function startAuth(phoneNumber: string) {
    const supabase = await createClient()

    // PROFESSIONAL FIX: One method for both Sign Up and Login
    // Note: Requires "Phone" provider enabled in Supabase
    const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
        options: {
            // This tells Supabase: "If they don't exist, create them. If they do, log them in."
            shouldCreateUser: true,
        },
    })

    if (error) {
        console.error('Auth Error:', error.message)
        return { success: false, message: error.message }
    }

    return { success: true }
}

export async function verifyOtp(phoneNumber: string, token: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token,
        type: 'sms'
    })

    if (error) {
        return { success: false, message: error.message }
    }

    return { success: true }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}
