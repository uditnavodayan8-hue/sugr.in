import { Suspense } from 'react';
import OnboardingForm from '@/components/onboarding/OnboardingForm';

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <OnboardingForm />
        </Suspense>
    );
}
