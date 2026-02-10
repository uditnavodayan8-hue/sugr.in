import { Suspense } from 'react';
import OnboardingForm from '@/components/onboarding/OnboardingForm';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
    const { userId } = await auth();
    if (!userId) {
        redirect('/');
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <OnboardingForm />
        </Suspense>
    );
}
