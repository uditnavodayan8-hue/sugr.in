import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DiscoveryFeed from '@/components/discovery/DiscoveryFeed';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default async function DashboardPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Component context
                    }
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile?.role) {
        redirect('/onboarding');
    }

    // Fetch active ads (not expired) with user info
    const { data: ads, error } = await supabase
        .from('ads')
        .select(`
            *,
            profiles:user_id (
                full_name,
                avatar_url,
                role
            )
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error("Error fetching ads:", error);
    }

    // Transform ads to include user info at top level
    const transformedAds = (ads || []).map(ad => ({
        ...ad,
        user_name: ad.profiles?.full_name,
        user_avatar: ad.profiles?.avatar_url,
        user_role: ad.profiles?.role,
    }));

    return (
        <main className="relative">
            <DashboardHeader />
            <DiscoveryFeed initialAds={transformedAds} />
        </main>
    );
}
