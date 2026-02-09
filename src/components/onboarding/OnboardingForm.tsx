'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Star, ArrowRight, Check, Upload, Camera } from 'lucide-react';
import Step1_Role from './Step1_Role';
import Step2_Dossier from './Step2_Dossier';
import Step3_Identity from './Step3_Identity';
import { getSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Role = 'provider' | 'protege';
type LifestyleTier = 'executive' | 'elite' | 'premium';

const ROLES = [
    {
        id: 'provider' as Role,
        title: 'Provider',
        subtitle: 'I am here to provide',
        description: 'Successful individuals seeking meaningful connections with ambitious companions.',
        icon: Shield,
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        id: 'protege' as Role,
        title: 'Protégé',
        subtitle: 'I am seeking growth',
        description: 'Ambitious individuals seeking mentorship and elevated lifestyle experiences.',
        icon: Star,
        gradient: 'from-purple-500 to-pink-600',
    },
];

const TIERS = [
    { id: 'executive' as LifestyleTier, label: 'Executive', description: 'High-net-worth professional' },
    { id: 'elite' as LifestyleTier, label: 'Elite', description: 'Ultra-high-net-worth' },
    { id: 'premium' as LifestyleTier, label: 'Premium', description: 'First-class lifestyle' },
];

export default function OnboardingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const isEditMode = mode === 'edit';
    const initialStep = searchParams.get('step') === 'verify' ? 3 : (isEditMode ? 2 : 1);

    const [step, setStep] = useState(initialStep);
    const [role, setRole] = useState<Role | null>(null);
    const [username, setUsername] = useState('');
    const [tier, setTier] = useState<LifestyleTier>('executive');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode); // Add loading state for fetching profile

    const supabase = getSupabaseClient();

    // Fetch profile data if in edit mode
    useEffect(() => {
        if (!isEditMode) return;

        async function fetchProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('profiles')
                    .select('role, username, lifestyle_tier, bio')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                if (data) {
                    if (data.role) setRole(data.role as Role);
                    if (data.username) setUsername(data.username);
                    if (data.lifestyle_tier) setTier(data.lifestyle_tier as LifestyleTier);
                    if (data.bio) setBio(data.bio);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                toast.error('Failed to load profile data');
            } finally {
                setFetching(false);
            }
        }

        fetchProfile();
    }, [isEditMode, supabase]);

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setTimeout(() => setStep(2), 300);
    };

    const handleProfileSubmit = async () => {
        if (!role || !username.trim()) {
            toast.error('Please complete all fields');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('profiles')
                .update({
                    role,
                    username,
                    lifestyle_tier: tier,
                    bio,
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success(isEditMode ? 'Profile updated successfully' : 'Profile created!');

            if (isEditMode) {
                router.push('/profile');
            } else {
                setStep(3);
            }
        } catch (err: any) {
            toast.error('Failed to update profile', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationInitiate = async () => {
        setLoading(true);
        // Simulate verification initiation
        setTimeout(() => {
            setLoading(false);
            toast.info('Verification initiated', {
                description: 'Please follow the instructions sent to your email.'
            });
            // For demo purposes, we might want to just complete it via a developer tool later
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Progress - Hide in edit mode or show full? Let's hide it in edit mode as it's not really a wizard flow then, or keep it 100%? */}
            {!isEditMode && (
                <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            )}

            <div className="flex-1 flex items-center justify-center p-6">
                {fetching ? (
                    <div className="flex items-center gap-2 text-white/50">
                        <span className="animate-spin text-xl">◌</span> Loading profile...
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {/* Step 1: Role Selection (Liquid UI) */}
                        {step === 1 && (
                            <Step1_Role onSelect={(r) => handleRoleSelect(r)} />
                        )}

                        {/* Step 2: Profile Details */}
                        {step === 2 && (
                            <Step2_Dossier
                                username={username}
                                setUsername={setUsername}
                                tier={tier}
                                setTier={setTier}
                                bio={bio}
                                setBio={setBio}
                                loading={loading}
                                onSubmit={handleProfileSubmit}
                                onBack={() => isEditMode ? router.back() : setStep(1)}
                                isEditMode={isEditMode}
                            />
                        )}

                        {/* Step 3: Identity Anchor (Verification) */}
                        {step === 3 && !isEditMode && (
                            <Step3_Identity
                                loading={loading}
                                onInitiate={handleVerificationInitiate}
                            />
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
