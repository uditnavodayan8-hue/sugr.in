'use client';
import { Crown, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/hooks/useOnboarding';

interface StepProps {
    onNext: () => void;
}

export default function Step2_Role({ onNext }: StepProps) {
    const { data, saveStepData, saving } = useOnboarding();
    const [role, setRole] = useState<'Provider' | 'Protégé' | ''>(data.role);

    useEffect(() => {
        setRole(data.role);
    }, [data.role]);

    const handleNext = async () => {
        if (!role) return;
        const success = await saveStepData({ role });
        if (success) {
            onNext();
        }
    };

    return (
        <div className="space-y-12">
            <header className="text-center space-y-4">
                <h2 className="text-4xl font-serif tracking-tight">The Role</h2>
                <p className="text-zinc-500 text-sm italic">"Define your position in the dynamic."</p>
            </header>

            <div className="grid grid-cols-2 gap-4 py-8">
                <button
                    onClick={() => setRole('Provider')}
                    className={cn(
                        "relative flex flex-col items-center justify-center p-8 gap-6 rounded-2xl border transition-all duration-300 h-64",
                        role === 'Provider'
                            ? "bg-zinc-900 border-[#F7E7CE]"
                            : "bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900/80"
                    )}
                >
                    <Crown size={32} className={role === 'Provider' ? "text-[#F7E7CE]" : "text-zinc-600"} />
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-serif">Provider</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Benefactor / Mentor</p>
                    </div>
                </button>

                <button
                    onClick={() => setRole('Protégé')}
                    className={cn(
                        "relative flex flex-col items-center justify-center p-8 gap-6 rounded-2xl border transition-all duration-300 h-64",
                        role === 'Protégé'
                            ? "bg-zinc-900 border-[#F7E7CE]"
                            : "bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900/80"
                    )}
                >
                    <Sparkles size={32} className={role === 'Protégé' ? "text-[#F7E7CE]" : "text-zinc-600"} />
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-serif">Protégé</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Muse / Companion</p>
                    </div>
                </button>
            </div>

            <button
                onClick={handleNext}
                disabled={!role || saving}
                className="w-full py-5 bg-white text-black text-xs font-black tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? 'Saving...' : 'Confirm Role'}
            </button>
        </div>
    );
}
