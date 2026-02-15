'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Step1_Role from './Step1_Role';
import Step2_Dossier from './Step2_Dossier';
import Step3_Photos from './Step3_Photos'; // Assuming you created this
import { updateProfile } from '@/app/actions/profile'; // Use the generic update
import { toast } from 'sonner';

type OnboardingStep = 'role' | 'dossier' | 'photos';

export default function OnboardingForm() {
    const [step, setStep] = useState<OnboardingStep>('role');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        role: '' as 'provider' | 'protege' | '',
        name: '',
        age: '',
        city: '',
        username: '',
        bio: '',
        tier: 'executive' as 'executive' | 'elite' | 'premium',
    });

    const handleRoleSelect = (role: 'provider' | 'protege') => {
        setFormData(prev => ({ ...prev, role }));
        setStep('dossier');
    };

    const handleDossierChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDossierSubmit = () => {
        setStep('photos');
    };

    const handlePhotoComplete = async (photoUrl: string) => {
        setLoading(true);
        try {
            // Final Submission
            // Final Submission
            const result = await updateProfile({
                role: formData.role as string,
                username: formData.username,
                lifestyle_tier: formData.tier,
                bio: formData.bio,
                name: formData.name,
                age: parseInt(formData.age),
                city: formData.city,
                avatar_url: photoUrl,
            });

            if (result.success) {
                router.push('/dashboard');
            } else {
                toast.error('Failed to create profile', { description: result.error || 'Please try again' });
                setLoading(false);
            }
        } catch (error: any) {
            console.error('Profile update error:', error);
            toast.error('Failed to create profile', { description: error.message });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">
            {/* Background elements (subtle) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50 z-0" />

            <div className="relative z-10 w-full max-w-4xl flex justify-center">
                <AnimatePresence mode="wait">
                    {step === 'role' && (
                        <Step1_Role key="step1" onSelect={handleRoleSelect} />
                    )}

                    {step === 'dossier' && (
                        <Step2_Dossier
                            key="step2"
                            data={formData}
                            onChange={handleDossierChange}
                            onSubmit={handleDossierSubmit}
                            loading={false}
                            onBack={() => setStep('role')}
                        />
                    )}

                    {step === 'photos' && (
                        <Step3_Photos
                            key="step3"
                            onBack={() => setStep('dossier')}
                            onComplete={handlePhotoComplete}
                            loading={loading}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
