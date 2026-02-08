'use client';

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Profile } from '@/lib/services/profiles';
import ProfileCard from './ProfileCard';
import { sendAccessRequest } from '@/lib/services/access';
import { toast } from 'sonner';
import { X, KeyRound, RotateCw } from 'lucide-react';

interface SwipeFeedProps {
    initialProfiles: Profile[];
    currentUserId: string;
}

export default function SwipeFeed({ initialProfiles, currentUserId }: SwipeFeedProps) {
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
    const [history, setHistory] = useState<Profile[]>([]); // For undo functionality (optional)

    // Motion values for the top card
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Background color indicators
    const likeOpacity = useTransform(x, [0, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

    const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            handleSwipe('right');
        } else if (info.offset.x < -threshold) {
            handleSwipe('left');
        }
    };

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (profiles.length === 0) return;

        const currentProfile = profiles[0];

        // Optimistic UI update
        const newProfiles = profiles.slice(1);
        setProfiles(newProfiles);
        setHistory(prev => [currentProfile, ...prev]);

        if (direction === 'right') {
            // Request Access
            try {
                // Haptic feedback
                if (navigator.vibrate) navigator.vibrate(50);

                const { success, match, error } = await sendAccessRequest(currentUserId, currentProfile.id);
                if (success) {
                    if (match) {
                        toast.success(`It's a Match!`, {
                            description: `You and ${currentProfile.name} can now connect.`,
                            duration: 5000,
                            icon: '🎉'
                        });
                    } else {
                        toast.success(`Access requested for ${currentProfile.name}`);
                    }
                } else {
                    console.error('Swipe request failed:', error);
                    // usage of toast error might be annoying if it happens often, but good for debug
                }
            } catch (err) {
                console.error('Swipe error:', err);
            }
        }
    };

    if (profiles.length === 0) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                    <KeyRound className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-2xl font-serif italic">No more profiles</h2>
                <p className="text-white/40 text-center max-w-xs">
                    You've seen everyone nearby. Check back later.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2 border border-white/20 rounded-full uppercase text-xs tracking-widest hover:bg-white/10 transition"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black overflow-hidden flex flex-col">
            <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence>
                    {profiles.map((profile, index) => {
                        // Only render the top 2 cards for performance
                        if (index > 1) return null;

                        const isTop = index === 0;

                        return (
                            <motion.div
                                key={profile.id}
                                style={{
                                    zIndex: profiles.length - index,
                                    x: isTop ? x : 0,
                                    rotate: isTop ? rotate : 0,
                                    scale: isTop ? 1 : 0.95,
                                    // opacity: isTop ? 1 : 0.4, // Keep background visible but dim?
                                }}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: isTop ? 1 : 0.95, opacity: 1 }}
                                exit={{ x: isTop ? (x.get() < 0 ? -1000 : 1000) : 0, opacity: 0, transition: { duration: 0.2 } }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                drag={isTop ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={handleDragEnd}
                                className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                            >
                                {/* Swipe Indicators */}
                                {isTop && (
                                    <>
                                        <motion.div
                                            style={{ opacity: likeOpacity }}
                                            className="absolute top-10 left-10 z-50 pointer-events-none"
                                        >
                                            <div className="border-4 border-emerald-500 text-emerald-500 text-4xl font-black uppercase tracking-widest px-4 py-2 rounded-lg -rotate-12 bg-black/20 backdrop-blur-sm">
                                                REQUEST
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            style={{ opacity: nopeOpacity }}
                                            className="absolute top-10 right-10 z-50 pointer-events-none"
                                        >
                                            <div className="border-4 border-red-500 text-red-500 text-4xl font-black uppercase tracking-widest px-4 py-2 rounded-lg rotate-12 bg-black/20 backdrop-blur-sm">
                                                NOPE
                                            </div>
                                        </motion.div>
                                    </>
                                )}

                                <ProfileCard
                                    profile={profile}
                                // Pass dummy onRemove to potentially hide built-in controls if we modify ProfileCard later
                                // For now, ProfileCard's own buttons will still work, which is fine as a backup
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Bottom Controls (Optional, for accessibility) */}
            <div className="absolute bottom-6 w-full flex justify-center gap-6 z-50 pointer-events-none">
                {/* 
                    We can add explicit buttons here if needed, 
                    but pure swipe is what users usually want.
                    The ProfileCard already has buttons, so we might have double buttons.
                    Ideally we would hide ProfileCard buttons via CSS or prop.
                 */}
            </div>
        </div>
    );
}
