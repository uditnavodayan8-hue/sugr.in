'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Star, ArrowRight, Check, Upload, Camera } from 'lucide-react';
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
    const initialStep = searchParams.get('step') === 'verify' ? 3 : 1;

    const [step, setStep] = useState(initialStep);
    const [role, setRole] = useState<Role | null>(null);
    const [tier, setTier] = useState<LifestyleTier>('executive');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);

    const supabase = getSupabaseClient();

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setTimeout(() => setStep(2), 300);
    };

    const handleProfileSubmit = async () => {
        if (!role) return;

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    role,
                    lifestyle_tier: tier,
                    bio,

                });

            if (error) throw error;

            toast.success('Profile updated!');
            setStep(3);
        } catch (err: any) {
            toast.error('Failed to update profile', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationInitiate = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Mark verification as initiated (not verified, just started)
            // In a real app, this would trigger a verification flow
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    is_verified: true, // For demo, auto-verify

                });

            if (error) throw error;

            toast.success('Verification complete!');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error('Verification failed', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Progress */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
                <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                        <motion.div
                            key="role"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-lg space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-serif italic">Choose Your Path</h1>
                                <p className="text-white/40 text-sm">This defines your experience on Sugr</p>
                            </div>

                            <div className="space-y-4">
                                {ROLES.map((r) => (
                                    <motion.button
                                        key={r.id}
                                        onClick={() => handleRoleSelect(r.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "w-full p-6 rounded-2xl text-left transition-all border",
                                            role === r.id
                                                ? "border-white/30 bg-white/5"
                                                : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                                                r.gradient
                                            )}>
                                                <r.icon size={24} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold">{r.title}</h3>
                                                <p className="text-sm text-white/50">{r.subtitle}</p>
                                                <p className="text-xs text-white/30 mt-2">{r.description}</p>
                                            </div>
                                            <ArrowRight size={20} className="text-white/30" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Profile Details */}
                    {step === 2 && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-lg space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-serif italic">Craft Your Dossier</h1>
                                <p className="text-white/40 text-sm">This is how others will see you</p>
                            </div>

                            <div className="space-y-6">
                                {/* Lifestyle Tier */}
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                                        Lifestyle Tier
                                    </label>
                                    <div className="flex gap-2">
                                        {TIERS.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTier(t.id)}
                                                className={cn(
                                                    "flex-1 py-3 px-4 rounded-xl text-center transition-all border",
                                                    tier === t.id
                                                        ? "bg-white text-black border-white"
                                                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                                                )}
                                            >
                                                <span className="text-xs font-bold uppercase tracking-wider">
                                                    {t.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                                        Your Tagline
                                    </label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="What makes you unique?"
                                        rows={3}
                                        maxLength={200}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none resize-none"
                                    />
                                    <p className="text-[10px] text-white/30 text-right">
                                        {bio.length}/200
                                    </p>
                                </div>

                                {/* Submit */}
                                <motion.button
                                    onClick={handleProfileSubmit}
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="animate-pulse">Saving...</span>
                                    ) : (
                                        <>
                                            Continue <ArrowRight size={16} />
                                        </>
                                    )}
                                </motion.button>

                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full text-center text-white/40 text-xs hover:text-white/60"
                                >
                                    Go back
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Identity Anchor (Verification) */}
                    {step === 3 && (
                        <motion.div
                            key="verify"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-lg space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Shield size={32} className="text-emerald-400" />
                                </div>
                                <h1 className="text-3xl font-serif italic">Identity Anchor</h1>
                                <p className="text-white/40 text-sm max-w-xs mx-auto">
                                    Verify your identity to unlock full access. This keeps our community safe.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Verification Options */}
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Camera size={20} className="text-white/50" />
                                        <div>
                                            <p className="text-sm font-bold">Photo Verification</p>
                                            <p className="text-xs text-white/40">Take a selfie to prove you're real</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Upload size={20} className="text-white/50" />
                                        <div>
                                            <p className="text-sm font-bold">ID Verification</p>
                                            <p className="text-xs text-white/40">Upload a government ID (optional)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Initiate */}
                                <motion.button
                                    onClick={handleVerificationInitiate}
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-emerald-500 text-black font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="animate-pulse">Verifying...</span>
                                    ) : (
                                        <>
                                            <Check size={16} /> Start Verification
                                        </>
                                    )}
                                </motion.button>

                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full text-center text-white/40 text-xs hover:text-white/60"
                                >
                                    Skip for now (limited access)
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
