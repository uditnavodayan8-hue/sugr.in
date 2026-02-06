

'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, X, Loader2, Shield, ChevronUp } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Profile } from '@/lib/services/profiles';
import { createSwipe } from '@/lib/services/matches';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MatchCelebration from './MatchCelebration';

interface ProfileCardProps {
    profile: Profile;
    onRemove?: (id: string) => void;
}

export default function ProfileCard({ profile, onRemove }: ProfileCardProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [swiping, setSwiping] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [showMatch, setShowMatch] = useState(false);

    // Reset photo index when profile changes
    useEffect(() => {
        setPhotoIndex(0);
        setShowMatch(false);
    }, [profile.id]);

    // Calculate available photos or fallback to avatar
    const photos = useMemo(() => {
        if (profile.photos && profile.photos.length > 0) {
            return profile.photos;
        }
        return [{ id: 'main', url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop&q=90' }];
    }, [profile]);

    const currentPhoto = photos[photoIndex];

    const handleUnlock = () => {
        setIsUnlocked(true);
        toast("Profile Revealed", {
            description: "Swipe to connect",
            duration: 2000,
        });
    };

    const handleSwipe = async (action: 'like' | 'pass') => {
        if (!user || swiping) return;
        setSwiping(true);

        try {
            const { isMatch } = await createSwipe(user.id, profile.id, action);

            if (isMatch) {
                setShowMatch(true);
                // Don't call onRemove yet
            } else {
                onRemove?.(profile.id);
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setSwiping(false);
        }
    };

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (photoIndex < photos.length - 1) {
            setPhotoIndex(prev => prev + 1);
        }
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (photoIndex > 0) {
            setPhotoIndex(prev => prev - 1);
        }
    };

    const handleDoubleTap = () => {
        handleSwipe('like');
        // Show heart animation (could adhere to mouse position or center)
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.transform = 'translate(-50%, -50%) scale(0)';
        heart.style.fontSize = '100px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '50';
        heart.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';

        // Append to current target if possible, or body
        // For simplicity in React, usually we'd use state, but DOM manipulation for a quick effect is okay or better use AnimatePresence
        // Let's use simpler approach: just call handleSwipe('like') for now.
    };

    return (
        <div
            className="relative w-full h-full bg-[#0A0A0A] overflow-hidden select-none group"
            onDoubleClick={handleDoubleTap}
        >
            {/* Image Layer */}
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.img
                        key={currentPhoto.url}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        src={currentPhoto.url}
                        alt=""
                        className={cn(
                            "w-full h-full object-cover transition-all duration-700 ease-out",
                            isUnlocked ? "blur-0 scale-100" : "blur-2xl scale-110 brightness-50"
                        )}
                        draggable={false}
                    />
                </AnimatePresence>

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-60% to-black/95 pointer-events-none" />

                {/* Navigation Taps (Only when unlocked) */}
                {isUnlocked && photos.length > 1 && (
                    <>
                        <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={prevPhoto} />
                        <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={nextPhoto} />
                    </>
                )}
            </motion.div>

            {/* Photo Indicators */}
            {photos.length > 1 && (
                <div className="absolute top-4 inset-x-4 flex gap-1 z-30">
                    {photos.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1 rounded-full flex-1 transition-colors duration-300",
                                i === photoIndex ? "bg-white" : "bg-white/20"
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Top Badge - Minimal */}
            <motion.div
                className="absolute top-8 left-8 z-20 pointer-events-none"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F7E7CE]" />
                    <span className="text-[11px] font-medium tracking-wide text-white/90">
                        {profile.role}
                    </span>
                </div>
            </motion.div>

            {/* Verification Badge */}
            {profile.verification_level?.id && (
                <motion.div
                    className="absolute top-8 right-8 z-20 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="w-10 h-10 rounded-full bg-[#F7E7CE]/10 backdrop-blur-xl border border-[#F7E7CE]/20 flex items-center justify-center">
                        <Shield size={16} className="text-[#F7E7CE]" />
                    </div>
                </motion.div>
            )}

            {/* Bottom Content */}
            <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none">
                <AnimatePresence mode="wait">
                    {!isUnlocked ? (
                        /* Locked State */
                        <motion.div
                            key="locked"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="flex flex-col items-center text-center px-8 pb-40 pt-20 pointer-events-auto"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center mb-6"
                            >
                                <Lock size={24} className="text-[#F7E7CE]" strokeWidth={1.5} />
                            </motion.div>

                            <h2 className="text-[28px] font-semibold text-white tracking-tight mb-1">
                                {profile.role === 'Provider' ? 'Private Profile' : 'Discover'}
                            </h2>
                            <p className="text-[15px] text-white/50 mb-8">
                                {profile.city} · {profile.age}
                            </p>

                            <motion.button
                                onClick={handleUnlock}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 rounded-full bg-[#F7E7CE] text-[#0A0A0A] font-semibold text-[15px] tracking-tight shadow-[0_0_40px_rgba(247,231,206,0.25)]"
                            >
                                Reveal Profile
                            </motion.button>
                        </motion.div>
                    ) : (
                        /* Unlocked State */
                        <motion.div
                            key="unlocked"
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                            className="bg-[#0A0A0A]/80 backdrop-blur-3xl border-t border-white/10 rounded-t-[32px] pointer-events-auto"
                        >
                            {/* Drag Indicator */}
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="w-full flex justify-center pt-4 pb-2"
                            >
                                <motion.div
                                    animate={{ rotate: expanded ? 180 : 0 }}
                                    className="w-8 h-1 rounded-full bg-white/20"
                                />
                            </button>

                            {/* Profile Info */}
                            <div className="px-8 pb-8">
                                <div className="flex items-end justify-between mb-2">
                                    <div>
                                        <h2 className="text-[32px] font-semibold text-white tracking-tight leading-tight">
                                            {profile.name}
                                        </h2>
                                        <p className="text-[15px] text-white/50 mt-1">
                                            {profile.age} · {profile.city}
                                        </p>
                                    </div>

                                    {profile.trust_score && (
                                        <div className="text-right">
                                            <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Trust</div>
                                            <div className="text-[20px] font-semibold text-[#F7E7CE]">{profile.trust_score}%</div>
                                        </div>
                                    )}
                                </div>

                                {/* Expandable Bio */}
                                <AnimatePresence>
                                    {expanded && profile.bio && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-[15px] text-white/60 leading-relaxed mt-4 pb-4 border-b border-white/5">
                                                {profile.bio}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center gap-6 mt-8 pb-8">
                                    <motion.button
                                        onClick={() => handleSwipe('pass')}
                                        disabled={swiping}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                                    >
                                        <X size={26} strokeWidth={1.5} />
                                    </motion.button>

                                    <motion.button
                                        onClick={() => handleSwipe('like')}
                                        disabled={swiping}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-20 h-20 rounded-full bg-[#F7E7CE] shadow-[0_4px_30px_rgba(247,231,206,0.4)] flex items-center justify-center text-[#0A0A0A] disabled:opacity-50"
                                    >
                                        {swiping ? (
                                            <Loader2 size={28} className="animate-spin" />
                                        ) : (
                                            <Heart size={28} strokeWidth={1.5} fill="currentColor" />
                                        )}
                                    </motion.button>

                                    <motion.button
                                        onClick={() => setExpanded(!expanded)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <ChevronUp size={22} strokeWidth={1.5} className={cn("transition-transform", expanded && "rotate-180")} />
                                    </motion.button>
                                </div>

                                {/* View Full Profile Link */}
                                <button
                                    onClick={() => router.push(`/profile/${profile.id}`)}
                                    className="w-full py-3 text-center text-[13px] text-white/40 hover:text-[#F7E7CE] transition-colors border-t border-white/5"
                                >
                                    View Full Profile →
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {showMatch && (
                <MatchCelebration
                    partner={profile}
                    onClose={() => {
                        setShowMatch(false);
                        onRemove?.(profile.id);
                    }}
                />
            )}
        </div>
    );
}
