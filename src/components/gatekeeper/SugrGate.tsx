'use client';

import * as React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import AuthModal from './AuthModal';
import InviteModal from './InviteModal';

export default function SugrGate() {
    const router = useRouter();
    const [isHolding, setIsHolding] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [verified, setVerified] = React.useState(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

    const handleVerificationComplete = async () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        // Direct Auth Access (Bypass Invite Key)
        setIsAuthModalOpen(true);
    };

    const handleInviteValid = () => {
        setIsInviteModalOpen(false);
        setTimeout(() => setIsAuthModalOpen(true), 300);
    };

    React.useEffect(() => {
        if (isHolding) {
            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 20);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setProgress((prev) => Math.max(0, prev - 5));
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHolding]);

    React.useEffect(() => {
        if (progress >= 100 && !verified) {
            handleVerificationComplete();
        }
    }, [progress, verified]);

    return (
        <>
            <div className="flex flex-col items-center justify-center space-y-8 select-none">
                <div
                    className="relative w-32 h-32 flex items-center justify-center cursor-pointer group"
                    onMouseDown={() => !verified && setIsHolding(true)}
                    onMouseUp={() => !verified && setIsHolding(false)}
                    onMouseLeave={() => !verified && setIsHolding(false)}
                    onTouchStart={() => !verified && setIsHolding(true)}
                    onTouchEnd={() => !verified && setIsHolding(false)}
                >
                    {/* Outer Metallic Ring */}
                    <div className="absolute inset-0 rounded-full border border-[#333] group-hover:border-[#F7E7CE]/30 transition-colors duration-500" />

                    {/* Inner Glass Platform */}
                    <div className="absolute inset-2 rounded-full bg-[#111] shadow-inner flex items-center justify-center">
                        {/* Progress Ring (Gold) */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                            <motion.circle
                                cx="50%"
                                cy="50%"
                                r="46%"
                                stroke="#F7E7CE"
                                strokeWidth="2"
                                fill="none"
                                // strokeDasharray="289" // Calculated dynamically or estimated
                                strokeDasharray="160" // Approx for this size
                                strokeLinecap="round"
                                strokeDashoffset={160 - (160 * progress) / 100}
                                className="transition-all duration-75 ease-linear drop-shadow-[0_0_8px_rgba(247,231,206,0.6)]"
                            />
                        </svg>

                        {/* Center Jewel */}
                        <div className={cn("relative z-10 w-4 h-4 rounded-sm rotate-45 transition-all duration-300",
                            verified ? "bg-[#F7E7CE] shadow-[0_0_20px_#F7E7CE] scale-125" : "bg-[#333] group-hover:bg-[#555]"
                        )} />
                    </div>

                    {/* Ambient Glow */}
                    {isHolding && !verified && (
                        <div className="absolute inset-0 rounded-full bg-[#F7E7CE]/10 blur-2xl transition-opacity duration-500" />
                    )}
                </div>

                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 group-hover:text-[#F7E7CE] transition-colors">
                    {verified ? 'Entering...' : 'Initialize'}
                </p>
            </div>

            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => { setIsInviteModalOpen(false); setProgress(0); setVerified(false); }}
                onValid={handleInviteValid}
            />

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
