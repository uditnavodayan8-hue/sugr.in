import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Ignore - called from Server Component
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check if user has completed onboarding
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Check if profile exists with required fields
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('name, avatar_url')
                    .eq('id', user.id)
                    .single()

                // If profile has name AND avatar, they've completed onboarding -> go to dashboard
                if (profile?.name && profile?.avatar_url) {
                    return NextResponse.redirect(`${origin}/dashboard`)
                }
            }

            // New user or incomplete profile -> go to onboarding
            return NextResponse.redirect(`${origin}/onboarding`)
        }
    }

    // Error case
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

