import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function Home() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/welcome');
  }

  try {
    const supabase = createAdminClient();

    // 1. Try to get profile
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // 2. If missing, create it (Server-Side Sync)
    if (!profile) {
      const newProfile = {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress,
        username: `user_${userId.slice(-6)}`,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        avatar_url: user.imageUrl,
        role: 'explorer',
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('profiles').insert(newProfile).select().single();
      if (data) profile = data;
      if (error) console.error("Auto-creation failed:", error);
    }

    // 3. Check completion
    if (profile && profile.role !== 'explorer' && profile.role !== null && profile.age > 0) {
      redirect('/discovery');
    }
  } catch (error) {
    console.error("Profile sync error:", error);
    // Fallback: If redirect happened in try block, it's caught here. 
    // We must re-throw if it's a redirect error, OR handle checking error type.
    // Simplify: Move redirect out, or check error property/instance.
    // Next.js redirect() throws an error with digest 'NEXT_REDIRECT'.
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    // Real error (e.g. Supabase connection): fall through to onboarding
  }

  // Otherwise, user needs to complete setup (or fallback)
  redirect('/onboarding');
}
