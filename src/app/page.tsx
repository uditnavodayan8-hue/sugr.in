import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/welcome');
  }

  // Check profile state
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If profile is fully set up, go to discovery
  if (profile && profile.role !== 'explorer' && profile.role !== null) {
    redirect('/discovery');
  }

  // Otherwise, onboarding
  redirect('/onboarding');
}
