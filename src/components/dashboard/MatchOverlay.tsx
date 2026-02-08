'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
import { Profile } from '@/lib/services/profiles';
import { useEffect } from 'react';

interface MatchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    currentProfile: Profile; // The current user
    matchedProfile: Profile; // The user they matched with
}

export default function MatchOverlay({ isOpen, onClose, currentProfile, matchedProfile }: MatchOverlayProps) {
    const router = useRouter();

    // Auto-close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white p-6"
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-[100px] animate-pulse" />
                    </div>

                    <div className="relative z-10 w-full max-w-md text-center">
                        {/* Title Animation */}
                        <motion.h2
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                            className="text-6xl font-black italic tracking-tighter mb-12 bg-gradient-to-r from-[#F7E7CE] via-white to-[#F7E7CE] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        >
                            IT'S A MATCH
                        </motion.h2>

                        {/* Avatars */}
                        <div className="flex items-center justify-center gap-4 mb-12 relative h-40">
                            {/* User 1 (Left) */}
                            <motion.div
                                initial={{ x: -100, opacity: 0, rotate: -20 }}
                                animate={{ x: 0, opacity: 1, rotate: -10 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
                                className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                <Image
                                    src={currentProfile.avatar_url || 'https://via.placeholder.com/150'}
                                    alt={currentProfile.name}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            {/* User 2 (Right) */}
                            <motion.div
                                initial={{ x: 100, opacity: 0, rotate: 20 }}
                                animate={{ x: 0, opacity: 1, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
                                className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.2)] -ml-8" // Negative margin for overlap
                            >
                                <Image
                                    src={matchedProfile.avatar_url || 'https://via.placeholder.com/150'}
                                    alt={matchedProfile.name}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            {/* Heart/Icon in middle */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8, type: "spring" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center z-20 shadow-xl"
                            >
                                <span className="text-2xl">⚡</span>
                            </motion.div>
                        </div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-white/60 mb-8 font-light"
                        >
                            You and <span className="text-white font-semibold">{matchedProfile.name}</span> have liked each other.
                        </motion.p>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="space-y-3"
                        >
                            <button
                                onClick={() => router.push(`/chat?match=${matchedProfile.id}`)}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
                            >
                                <MessageCircle size={18} fill="black" />
                                Send Message
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-transparent border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest text-xs"
                            >
                                Keep Swiping
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
