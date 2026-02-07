'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Step1_Identity from '@/components/onboarding/Step1_Identity';
import Step2_Role from '@/components/onboarding/Step2_Role';
import Step3_Vitals from '@/components/onboarding/Step3_Vitals';
import Step4_Arrangement from '@/components/onboarding/Step4_Arrangement';
import Step5_Vetting from '@/components/onboarding/Step5_Vetting';
import { useRouter } from 'next/navigation';

export default function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const router = useRouter();

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep((prev) => prev + 1);
        } else {
            // Complete
            router.push('/dashboard'); // Placeholder for next route
        }
    };

    const steps = [
        { id: 1, component: <Step1_Identity onNext={handleNext} /> },
        { id: 2, component: <Step2_Role onNext={handleNext} /> },
        { id: 3, component: <Step3_Vitals onNext={handleNext} /> },
        { id: 4, component: <Step4_Arrangement onNext={handleNext} /> },
        { id: 5, component: <Step5_Vetting onNext={handleNext} /> },
    ];

    return (
        <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Progress Bar (Subtle) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900">
                <motion.div
                    className="h-full bg-[#F7E7CE]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 5) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="w-full max-w-md relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {steps[currentStep - 1].component}
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}
