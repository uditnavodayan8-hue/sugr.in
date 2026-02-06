'use client';
import { motion } from 'framer-motion';
import { User, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/hooks/useOnboarding';

interface StepProps {
    onNext: () => void;
}

export default function Step1_Identity({ onNext }: StepProps) {
    const { data, updateData, saveStepData, saving } = useOnboarding();
    const [name, setName] = useState(data.name);
    const [selected, setSelected] = useState<string>(data.gender);

    // Sync with onboarding data
    useEffect(() => {
        setName(data.name);
        setSelected(data.gender);
    }, [data.name, data.gender]);

    const identities = [
        { id: 'female', label: 'Female', icon: User },
        { id: 'male', label: 'Male', icon: User },
        { id: 'non-binary', label: 'Non-Binary', icon: Users },
    ];

    const handleNext = async () => {
        const success = await saveStepData({ name, gender: selected });
        if (success) {
            onNext();
        }
    };

    const isValid = selected && name.trim().length >= 2;

    return (
        <div className="space-y-8">
            <header className="text-center space-y-4">
                <h2 className="text-4xl font-serif tracking-tight">Identity Anchor</h2>
                <p className="text-zinc-500 text-sm italic">"How should we address you?"</p>
            </header>

            {/* Name Input */}
            <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold ml-1">Preferred Name</label>
                <input
                    type="text"
                    placeholder="E.g. Kabir"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#F7E7CE] transition-colors"
                    minLength={2}
                    maxLength={50}
                />
                {name && name.length < 2 && (
                    <p className="text-[10px] text-red-400 ml-1">Name must be at least 2 characters</p>
                )}
            </div>

            {/* Gender Selection */}
            <div className="grid grid-cols-1 gap-3">
                {identities.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSelected(item.id)}
                        className={cn(
                            "group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                            selected === item.id
                                ? "bg-zinc-900 border-[#F7E7CE] shadow-[0_0_15px_rgba(247,231,206,0.15)]"
                                : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-3 rounded-full transition-colors",
                                selected === item.id ? "bg-[#F7E7CE] text-black" : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                            )}>
                                <item.icon size={20} />
                            </div>
                            <span className={cn(
                                "text-sm font-medium tracking-widest uppercase",
                                selected === item.id ? "text-white" : "text-zinc-500"
                            )}>
                                {item.label}
                            </span>
                        </div>
                        {selected === item.id && (
                            <motion.div layoutId="selection" className="w-2 h-2 rounded-full bg-[#F7E7CE]" />
                        )}
                    </button>
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={!isValid || saving}
                className="w-full py-5 bg-white text-black text-xs font-black tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? 'Saving...' : 'Secure Identity'}
            </button>
        </div>
    );
}
