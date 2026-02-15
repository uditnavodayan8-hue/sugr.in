'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Step1_Role from './Step1_Role';
import Step2_Dossier from './Step2_Dossier';
import Step3_Photos from './Step3_Photos';
import { updateProfile } from '@/app/actions/profile';
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

    // Helper for Haptics
    const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(20); // Light tap
        }
    };

    const saveStep = async (data: Record<string, any>) => {
        const payload = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            payload.append(key, value.toString());
        });

        const result = await updateProfile(payload);
        if (!result.success) {
            toast.error("Sync failed", { description: "Could not save progress" });
        }
        return result.success;
    };

    const handleRoleSelect = async (role: 'provider' | 'protege') => {
        triggerHaptic();
        setFormData(prev => ({ ...prev, role }));

        // Immediate Save
        await saveStep({ role });

        setStep('dossier');
    };

    const handleDossierChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDossierSubmit = async () => {
        triggerHaptic();
        setLoading(true);

        // Save Dossier Data
        const success = await saveStep({
            name: formData.name,
            username: formData.username, // mapping might be needed if DB col is different
            age: formData.age,
            city: formData.city,
            bio: formData.bio,
            lifestyle_tier: formData.tier
        });

        setLoading(false);
        if (success) setStep('photos');
    };

    const handlePhotoComplete = async (photoUrl: string) => {
        setLoading(true);
        try {
            // Final Save with Avatar
            const payload = new FormData();
            payload.append('avatar_url', photoUrl);
            // Ensure status is active/complete if you have such a flag, or just presence of data is enough.

            const result = await updateProfile(payload);

            if (result.success) {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate([50, 50, 50]); // Success pattern
                }
                toast.success("Profile Activated");
                router.push('/discovery'); // Redirect to discovery instead of dashboard for flow
            } else {
                toast.error('Failed to finish', { description: result.error });
            }
        } catch (error: any) {
            console.error('Profile update error:', error);
            toast.error('Error', { description: error.message });
        } finally {
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
                            loading={loading}
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
