'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type LifestyleTier = 'executive' | 'elite' | 'premium';

interface Step2_DossierProps {
    data: {
        name: string;
        age: string;
        city: string;
        username: string;
        bio: string;
        tier: LifestyleTier;
    };
    onChange: (field: string, value: any) => void;
    loading: boolean;
    onSubmit: () => void;
    onBack?: () => void;
}

const TIERS = [
    { id: 'executive' as LifestyleTier, label: 'Executive', description: 'High-net-worth professional' },
    { id: 'elite' as LifestyleTier, label: 'Elite', description: 'Ultra-high-net-worth' },
    { id: 'premium' as LifestyleTier, label: 'Premium', description: 'First-class lifestyle' },
];

export default function Step2_Dossier({
    data, onChange, loading, onSubmit, onBack
}: Step2_DossierProps) {
    const isValid = data.name && data.age && data.city && data.username;

    return (
        <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg space-y-8 p-6"
        >
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif italic">The Essentials</h1>
                <p className="text-white/40 text-sm">Tell us who you are</p>
            </div>

            <div className="space-y-5">
                {/* Name & Age Row */}
                <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Name</label>
                        <input
                            value={data.name}
                            onChange={(e) => onChange('name', e.target.value)}
                            placeholder="Your Name"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none transition-all"
                        />
                    </div>
                    <div className="w-24 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Age</label>
                        <input
                            type="number"
                            value={data.age}
                            onChange={(e) => onChange('age', e.target.value)}
                            placeholder="25"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">City (Base)</label>
                    <input
                        value={data.city}
                        onChange={(e) => onChange('city', e.target.value)}
                        placeholder="e.g. New York, Dubai, London"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none transition-all"
                    />
                </div>

                {/* Username */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Username</label>
                    <input
                        value={data.username}
                        onChange={(e) => onChange('username', e.target.value)}
                        placeholder="@handle"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none transition-all"
                    />
                </div>

                {/* Lifestyle Tier */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Lifestyle</label>
                    <div className="flex gap-2">
                        {TIERS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => onChange('tier', t.id)}
                                className={cn(
                                    "flex-1 py-3 px-2 rounded-xl text-center transition-all border",
                                    data.tier === t.id
                                        ? "bg-white text-black border-white"
                                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                                )}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-wider block">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Bio</label>
                    <textarea
                        value={data.bio}
                        onChange={(e) => onChange('bio', e.target.value)}
                        placeholder="What are you looking for?"
                        rows={3}
                        maxLength={200}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none resize-none"
                    />
                </div>

                {/* Submit */}
                <motion.button
                    onClick={onSubmit}
                    disabled={!isValid || loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                    Continue <ArrowRight size={16} />
                </motion.button>

                <button
                    onClick={onBack}
                    className="w-full text-center text-white/40 text-xs hover:text-white/60"
                >
                    Back to Role Selection
                </button>
            </div>
        </motion.div>
    );
}
