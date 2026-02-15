import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/welcome');
  }

  // Check if profile is fully onboarded
  const supabase = await createClient(); // Anon client is fine for reading profiles (public RLS)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, age')
    .eq('id', userId)
    .single();

  // Condition for "Onboarded":
  // 1. Profile exists
  // 2. Role is NOT 'explorer' (default)
  // 3. Age is likely set (as a secondary check)
  if (profile && profile.role !== 'explorer' && profile.age > 0) {
    redirect('/discovery');
  }

  // Otherwise, user needs to complete setup
  redirect('/onboarding');
}
