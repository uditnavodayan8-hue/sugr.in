'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useSugr } from '@/context/SugrContext';
import { Clock, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Ad {
    id: string;
    user_id: string;
    content: string;
    tier: 'executive' | 'elite' | 'premium';
    expires_at: string;
    created_at: string;
    // Joined from profiles
    user_name?: string;
    user_avatar?: string;
    user_role?: string;
}

interface DiscoveryFeedProps {
    initialAds: Ad[];
}

const TIER_COLORS = {
    executive: 'text-amber-400',
    elite: 'text-purple-400',
    premium: 'text-emerald-400',
};

const TIER_BG = {
    executive: 'from-amber-900/20',
    elite: 'from-purple-900/20',
    premium: 'from-emerald-900/20',
};

export default function DiscoveryFeed({ initialAds }: DiscoveryFeedProps) {
    const [ads, setAds] = useState<Ad[]>(initialAds);
    const [requesting, setRequesting] = useState<string | null>(null);
    const { profile } = useSugr();
    const supabase = getSupabaseClient();

    // Real-time subscription for new ads
    useEffect(() => {
        const channel = supabase.channel('live-ads')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ads' },
                async (payload: { new: Record<string, unknown> }) => {
                    // Fetch the user info for the new ad
                    const newAdData = payload.new as unknown as Ad;
                    const { data: userData } = await supabase
                        .from('profiles')
                        .select('full_name, avatar_url, role')
                        .eq('id', newAdData.user_id)
                        .single();

                    const newAd: Ad = {
                        ...newAdData,
                        user_name: userData?.full_name,
                        user_avatar: userData?.avatar_url,
                        user_role: userData?.role,
                    };

                    setAds(prev => [newAd, ...prev]);
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'ads' },
                (payload: { old: Record<string, unknown> }) => {
                    const deletedAd = payload.old as unknown as Ad;
                    setAds(prev => prev.filter(ad => ad.id !== deletedAd.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    // Request access to ad poster
    const handleRequestAccess = async (targetUserId: string) => {
        if (!profile) return;
        setRequesting(targetUserId);

        try {
            const { error } = await supabase
                .from('access_requests')
                .insert({
                    requester_id: profile.id,
                    target_id: targetUserId,
                    status: 'pending',
                });

            if (error) {
                if (error.code === '23505') {
                    // Duplicate - already requested
                    console.log('Already requested access');
                } else {
                    console.error('Error requesting access:', error);
                }
            }
        } finally {
            setRequesting(null);
        }
    };

    // Calculate time remaining
    const getTimeRemaining = (expiresAt: string) => {
        const diff = new Date(expiresAt).getTime() - Date.now();
        if (diff <= 0) return 'Expired';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    if (ads.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-8">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-2xl font-serif italic mb-2">The void awaits</h2>
                <p className="text-white/40 text-center max-w-xs">
                    No broadcasts are live right now. Be the first to post.
                </p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
            <AnimatePresence mode="popLayout">
                {ads.map((ad, index) => (
                    <motion.section
                        key={ad.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-screen snap-start relative flex flex-col justify-end"
                    >
                        {/* Full-bleed Aesthetic Background */}
                        <div className="absolute inset-0 z-0">
                            {ad.user_avatar ? (
                                <img
                                    src={ad.user_avatar}
                                    alt=""
                                    className="w-full h-full object-cover opacity-30 grayscale blur-sm"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900" />
                            )}
                            {/* Gradient overlay */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-t to-transparent",
                                TIER_BG[ad.tier],
                                "via-black/80 from-black"
                            )} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-8 pb-24 space-y-6">
                            {/* Tier Badge */}
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "text-[10px] font-mono tracking-[0.3em] uppercase",
                                    TIER_COLORS[ad.tier]
                                )}>
                                    {ad.tier}
                                </span>
                                <span className="text-white/30">•</span>
                                <span className="flex items-center gap-1 text-[10px] text-white/40">
                                    <Clock size={10} />
                                    {getTimeRemaining(ad.expires_at)}
                                </span>
                                {ad.user_role === 'provider' && (
                                    <>
                                        <span className="text-white/30">•</span>
                                        <Shield size={12} className="text-amber-500" />
                                    </>
                                )}
                            </div>

                            {/* Ad Content */}
                            <h2 className="text-3xl md:text-4xl font-serif italic text-white leading-tight max-w-lg">
                                "{ad.content}"
                            </h2>

                            {/* User Info */}
                            <div className="flex items-center gap-3">
                                {ad.user_avatar ? (
                                    <img
                                        src={ad.user_avatar}
                                        alt={ad.user_name || ''}
                                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/10" />
                                )}
                                <span className="text-white/60 text-sm">
                                    {ad.user_name || 'Anonymous'}
                                </span>
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                onClick={() => handleRequestAccess(ad.user_id)}
                                disabled={requesting === ad.user_id || ad.user_id === profile?.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "w-fit px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all",
                                    ad.user_id === profile?.id
                                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                                        : "bg-white text-black hover:bg-white/90"
                                )}
                            >
                                {requesting === ad.user_id ? (
                                    <span className="animate-pulse">Requesting...</span>
                                ) : ad.user_id === profile?.id ? (
                                    "Your Broadcast"
                                ) : (
                                    "Request Entry"
                                )}
                            </motion.button>
                        </div>

                        {/* Scroll indicator (only on first card) */}
                        {index === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
                            >
                                <span className="text-[8px] uppercase tracking-widest">Scroll</span>
                                <ChevronDown size={16} className="animate-bounce" />
                            </motion.div>
                        )}
                    </motion.section>
                ))}
            </AnimatePresence>
        </div>
    );
}
