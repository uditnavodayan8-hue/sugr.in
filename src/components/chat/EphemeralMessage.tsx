'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Clock, Flame, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EphemeralMessageProps {
    id: string;
    content: string;
    type: 'text' | 'image';
    imageUrl?: string;
    isMe: boolean;
    isViewed: boolean;
    onView: (id: string) => void;
    expiresAfterSeconds?: number;
}

export default function EphemeralMessage({
    id,
    content,
    type,
    imageUrl,
    isMe,
    isViewed,
    onView,
    expiresAfterSeconds = 5
}: EphemeralMessageProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [countdown, setCountdown] = useState(expiresAfterSeconds);
    const [hasExpired, setHasExpired] = useState(false);

    // Countdown after reveal
    useEffect(() => {
        if (!isRevealed || hasExpired) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setHasExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRevealed, hasExpired]);

    const handleReveal = () => {
        if (isViewed || isRevealed) return;
        setIsRevealed(true);
        onView(id);
    };

    // Already viewed - show placeholder
    if (isViewed && !isRevealed) {
        return (
            <div className={cn(
                "flex",
                isMe ? "justify-end" : "justify-start"
            )}>
                <div className={cn(
                    "px-4 py-3 rounded-2xl flex items-center gap-2",
                    "bg-white/[0.03] border border-white/[0.05]"
                )}>
                    <EyeOff size={14} className="text-white/30" />
                    <span className="text-[13px] text-white/30 italic">Message expired</span>
                </div>
            </div>
        );
    }

    // Expired after viewing
    if (hasExpired) {
        return (
            <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className={cn("flex", isMe ? "justify-end" : "justify-start")}
            >
                <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[13px] text-white/30 italic flex items-center gap-2">
                        <Flame size={14} /> Vanished
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
            <motion.div
                layout
                className="relative"
            >
                {/* Unrevealed State */}
                <AnimatePresence mode="wait">
                    {!isRevealed ? (
                        <motion.button
                            key="locked"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={handleReveal}
                            className={cn(
                                "relative px-6 py-4 rounded-2xl overflow-hidden",
                                "bg-gradient-to-br from-[#F7E7CE]/20 to-[#F7E7CE]/5",
                                "border border-[#F7E7CE]/30",
                                "hover:border-[#F7E7CE]/50 transition-all",
                                "active:scale-95"
                            )}
                        >
                            {/* Animated gradient border */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F7E7CE]/20 to-transparent animate-shimmer" />

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-[#F7E7CE]/10 flex items-center justify-center">
                                    <Lock size={18} className="text-[#F7E7CE]" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[14px] font-semibold text-white">
                                        {type === 'image' ? 'Secret Photo' : 'Secret Message'}
                                    </p>
                                    <p className="text-[11px] text-white/40 flex items-center gap-1">
                                        <Eye size={10} /> Tap to view once
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="revealed"
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            className="relative"
                        >
                            {/* Countdown Timer */}
                            <div className="absolute -top-2 -right-2 z-20">
                                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg animate-pulse">
                                    <span className="text-[11px] font-bold text-white">{countdown}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className={cn(
                                "px-4 py-3 rounded-2xl max-w-[260px]",
                                isMe
                                    ? "bg-[#F7E7CE] text-[#0A0A0A]"
                                    : "bg-white/[0.08] text-white",
                                "border-2 border-red-500/50"
                            )}>
                                {type === 'image' && imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="Ephemeral"
                                        className="rounded-xl max-w-full"
                                        style={{ userSelect: 'none', pointerEvents: 'none' }}
                                        draggable={false}
                                    />
                                ) : (
                                    <p className="text-[15px] leading-relaxed">{content}</p>
                                )}
                            </div>

                            {/* Warning */}
                            <p className="text-[10px] text-red-400 text-center mt-2 flex items-center justify-center gap-1">
                                <Clock size={10} /> Vanishing in {countdown}s
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
