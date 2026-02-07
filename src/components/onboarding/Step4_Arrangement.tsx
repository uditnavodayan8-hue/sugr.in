'use client';
import { motion } from 'framer-motion';
import { Heart, IndianRupee, Ghost, Sparkles, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/hooks/useOnboarding';

interface StepProps {
    onNext: () => void;
}

const TAGS = [
    { label: "Power Dynamics", icon: <Ghost size={14} /> },
    { label: "Travel & Tours", icon: <Sparkles size={14} /> },
    { label: "Mentorship", icon: <Heart size={14} /> },
    { label: "Event Companion", icon: <Sparkles size={14} /> },
    { label: "Casual / Fun", icon: <Flame size={14} /> },
    { label: "Fine Dining", icon: <Heart size={14} /> },
    { label: "Shopping", icon: <Sparkles size={14} /> },
    { label: "Discreet", icon: <Ghost size={14} /> },
];

const LIFESTYLE_TIERS = [
    { value: "Minimalist", label: "Under ₹50K", desc: "Mutually beneficial, low pressure." },
    { value: "Moderate", label: "₹50K - ₹1L", desc: "Comfortable, steady support." },
    { value: "High", label: "₹1L - ₹3L", desc: "Premium lifestyle, travel & gifts." },
    { value: "Ultra-High", label: "₹3L+", desc: "Luxury, full sponsorship." },
];

export default function Step4_Arrangement({ onNext }: StepProps) {
    const { data, saveStepData, saving } = useOnboarding();
    const [selectedTags, setSelectedTags] = useState<string[]>(data.tags || []);
    const [lifestyle_tier, setLifestyleTier] = useState(data.lifestyle_tier || LIFESTYLE_TIERS[1].value);

    useEffect(() => {
        setSelectedTags(data.tags || []);
        setLifestyleTier(data.lifestyle_tier || LIFESTYLE_TIERS[1].value);
    }, [data.tags, data.lifestyle_tier]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleNext = async () => {
        const success = await saveStepData({
            tags: selectedTags,
            lifestyle_tier,
        });
        if (success) {
            onNext();
        }
    };

    return (
        <div className="space-y-12">
            <header className="text-center space-y-4">
                <h2 className="text-4xl font-serif tracking-tight">Desire Profile</h2>
                <p className="text-zinc-500 text-sm italic">"Define your terms."</p>
            </header>

            <div className="space-y-10 py-4">
                {/* Lifestyle Tier Selection */}
                <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-[#F7E7CE]">
                        <IndianRupee size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Lifestyle Expectation</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {LIFESTYLE_TIERS.map((tier) => (
                            <button
                                key={tier.value}
                                onClick={() => setLifestyleTier(tier.value)}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-all border group",
                                    lifestyle_tier === tier.value
                                        ? "bg-[#F7E7CE] text-black border-[#F7E7CE]"
                                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900"
                                )}
                            >
                                <div className="text-left">
                                    <div className="text-xs font-bold uppercase tracking-wider mb-0.5">{tier.value}</div>
                                    <div className={cn("text-[10px]", lifestyle_tier === tier.value ? "opacity-80" : "opacity-40")}>
                                        {tier.label}
                                    </div>
                                </div>
                                <div className={cn("text-[10px] text-right max-w-[120px]", lifestyle_tier === tier.value ? "opacity-100" : "opacity-40")}>
                                    {tier.desc}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tags Selection */}
                <div className="space-y-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] text-center font-bold">
                        What are you looking for? (Select multiple)
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center">
                        {TAGS.map((tag) => (
                            <motion.button
                                key={tag.label}
                                onClick={() => toggleTag(tag.label)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "px-5 py-2.5 rounded-full border text-[11px] font-medium transition-all flex items-center gap-2",
                                    selectedTags.includes(tag.label)
                                        ? "bg-[#F7E7CE] text-black border-[#F7E7CE]"
                                        : "bg-black text-zinc-400 border-zinc-800 hover:text-white"
                                )}
                            >
                                {tag.icon}
                                {tag.label}
                            </motion.button>
                        ))}
                    </div>
                    {selectedTags.length > 0 && (
                        <p className="text-[9px] text-zinc-500 text-center">{selectedTags.length} selected</p>
                    )}
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={saving}
                className="w-full py-5 bg-white text-black text-xs font-black tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? 'Saving...' : 'Confirm Desires'}
            </button>
        </div>
    );
}
