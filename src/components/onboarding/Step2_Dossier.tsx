'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type LifestyleTier = 'executive' | 'elite' | 'premium';

interface Step2_DossierProps {
    username: string;
    setUsername: (v: string) => void;
    tier: LifestyleTier;
    setTier: (v: LifestyleTier) => void;
    bio: string;
    setBio: (v: string) => void;
    loading: boolean;
    onSubmit: () => void;
    onBack?: () => void;
    isEditMode?: boolean;
}

const TIERS = [
    { id: 'executive' as LifestyleTier, label: 'Executive', description: 'High-net-worth professional' },
    { id: 'elite' as LifestyleTier, label: 'Elite', description: 'Ultra-high-net-worth' },
    { id: 'premium' as LifestyleTier, label: 'Premium', description: 'First-class lifestyle' },
];

export default function Step2_Dossier({
    username, setUsername,
    tier, setTier,
    bio, setBio,
    loading, onSubmit, onBack, isEditMode
}: Step2_DossierProps) {
    return (
        <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg space-y-8"
        >
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif italic">{isEditMode ? 'Edit Profile' : 'Craft Your Dossier'}</h1>
                <p className="text-white/40 text-sm">{isEditMode ? 'Update your public details' : 'This is how others will see you'}</p>
            </div>

            <div className="space-y-6">
                {/* Username */}
                <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                        Username
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a unique handle"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none transition-all"
                    />
                </div>

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
                    onClick={onSubmit}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <span className="animate-pulse">Saving...</span>
                    ) : (
                        <>
                            {isEditMode ? 'Save Changes' : 'Continue'} <ArrowRight size={16} />
                        </>
                    )}
                </motion.button>

                <button
                    onClick={onBack}
                    className="w-full text-center text-white/40 text-xs hover:text-white/60"
                >
                    {isEditMode ? 'Cancel' : 'Go back'}
                </button>
            </div>
        </motion.div>
    );
}
