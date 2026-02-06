'use client';
import { Phone, CreditCard, Users, Wallet, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
    levels: {
        phone: boolean;
        id: boolean;
        social: boolean;
        wealth: boolean;
    };
    compact?: boolean;
}

const STEPS = [
    { key: 'phone', icon: Phone, label: 'Phone' },
    { key: 'id', icon: CreditCard, label: 'ID' },
    { key: 'social', icon: Users, label: 'Social' },
    { key: 'wealth', icon: Wallet, label: 'Wealth' },
] as const;

export default function VerificationBadge({ levels, compact = false }: VerificationBadgeProps) {
    const completedCount = Object.values(levels).filter(Boolean).length;
    const isElite = completedCount === 4;

    if (compact) {
        return (
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold", isElite ? "bg-gradient-to-r from-amber-500 to-yellow-300 text-black" : "bg-zinc-800 text-zinc-400")}>
                {isElite ? (
                    <>★ Elite</>
                ) : (
                    <>{completedCount}/4 Verified</>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Verification Status</span>
                {isElite && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 text-black text-[9px] font-bold uppercase rounded-full">
                        ★ Elite
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between">
                {STEPS.map((step, i) => {
                    const isComplete = levels[step.key as keyof typeof levels];
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="flex flex-col items-center gap-1 relative">
                            {/* Connector Line */}
                            {i < STEPS.length - 1 && (
                                <div className={cn("absolute top-3 left-1/2 w-full h-0.5", isComplete && levels[STEPS[i + 1].key as keyof typeof levels] ? "bg-[#F7E7CE]" : "bg-zinc-800")} style={{ transform: 'translateX(50%)' }} />
                            )}

                            {/* Icon */}
                            <div className={cn("relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-colors", isComplete ? "bg-[#F7E7CE] text-black" : "bg-zinc-800 text-zinc-600")}>
                                {isComplete ? <CheckCircle size={12} /> : <Icon size={12} />}
                            </div>

                            {/* Label */}
                            <span className={cn("text-[8px] uppercase tracking-wider", isComplete ? "text-[#F7E7CE]" : "text-zinc-600")}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
