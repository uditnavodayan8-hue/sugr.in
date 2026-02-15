import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function Home() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/welcome');
  }

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
      username: `user_${userId.slice(-6)}`, // Default username
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      avatar_url: user.imageUrl,
      role: 'explorer', // Default
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('profiles').insert(newProfile).select().single();
    if (data) profile = data;
    if (error) console.error("Auto-creation failed:", error);
  }

  // 3. Check completion
  // 'explorer' role means they haven't finished onboarding
  if (profile && profile.role !== 'explorer' && profile.role !== null && profile.age > 0) {
    redirect('/discovery');
  }

  // Otherwise, user needs to complete setup
  redirect('/onboarding');
}
