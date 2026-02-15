"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { getDiscoveryFeed, createSwipe, type DiscoveryFilters } from '@/lib/services/discovery';
import { type Profile } from '@/lib/services/profile';
import { toast } from 'sonner';
import CreateShout from '@/components/discovery/CreateShout';
import { createClient } from '@/lib/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';

// --- Types ---
interface Ad {
    id: string;
    content: string | null;
    media_url: string | null;
    created_at: string;
    user_id: string;
    profiles?: {
        name: string;
        display_name: string;
        avatar_url: string;
        tier: string;
    }
}

// --- Filters View ---
const FiltersView: React.FC<{
    filters: DiscoveryFilters;
    onApply: (newFilters: DiscoveryFilters) => void;
    onClose: () => void;
}> = ({ filters, onApply, onClose }) => {
    const [localFilters, setLocalFilters] = useState<DiscoveryFilters>(filters);

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-background-dark flex flex-col">
            <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full">
                    <Icon name="close" className="text-white" />
                </button>
                <h1 className="text-lg font-bold tracking-wide">Filters</h1>
                <button
                    onClick={() => setLocalFilters({})}
                    className="text-sm font-medium text-primary"
                >
                    Reset
                </button>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary/80">Age Range</h2>
                        <span className="text-lg font-medium text-white">
                            {localFilters.ageMin || 18} - {localFilters.ageMax || 65}
                        </span>
                    </div>
                    {/* Simplified range slider (using two inputs for now or a library later) */}
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Min"
                            className="bg-gray-800 text-white p-2 rounded w-full"
                            value={localFilters.ageMin || ''}
                            onChange={e => setLocalFilters({ ...localFilters, ageMin: parseInt(e.target.value) || undefined })}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="bg-gray-800 text-white p-2 rounded w-full"
                            value={localFilters.ageMax || ''}
                            onChange={e => setLocalFilters({ ...localFilters, ageMax: parseInt(e.target.value) || undefined })}
                        />
                    </div>
                </section>

                <div className="h-px w-full bg-white/5"></div>

                <section className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                        <span className="text-base font-medium text-white">Verified Profiles Only</span>
                        <span className="text-xs text-gray-400 mt-1">Show only users with ID verification</span>
                    </div>
                    <div
                        onClick={() => setLocalFilters({ ...localFilters, verifiedOnly: !localFilters.verifiedOnly })}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${localFilters.verifiedOnly ? 'bg-primary' : 'bg-gray-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${localFilters.verifiedOnly ? 'right-1' : 'left-1'}`}></div>
                    </div>
                </section>
            </main>

            <div className="p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-20">
                <button onClick={handleApply} className="w-full bg-primary text-black font-bold py-4 px-6 rounded-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                    Apply Filters
                    <Icon name="arrow_forward" className="text-lg group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}

// --- Discovery Feed ---
export default function DiscoveryPage() {
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [ads, setAds] = useState<Ad[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DiscoveryFilters>({});
    const supabase = createClient();

    useEffect(() => {
        loadFeed();
        loadAds();
        setupRealtime();
    }, [filters]);

    const setupRealtime = () => {
        const channel = supabase
            .channel('public:ads')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ads' },
                async (payload) => {
                    // Fetch full ad details including profile
                    const { data } = await supabase
                        .from('ads')
                        .select('*, profiles(name, display_name, avatar_url, tier)')
                        .eq('id', payload.new.id)
                        .single();

                    if (data) {
                        setAds(prev => [data as unknown as Ad, ...prev]);
                        toast.success("New Shout nearby!", { position: 'top-center' });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const loadAds = async () => {
        // Simple geo-query placeholder - fetch all for now, filter later or rely on RLS/PostGIS if setup
        const { data, error } = await supabase
            .from('ads')
            .select('*, profiles(name, display_name, avatar_url, tier)')
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error && data) {
            setAds(data as unknown as Ad[]);
        }
    };

    const loadFeed = async () => {
        setLoading(true);
        try {
            const data = await getDiscoveryFeed(filters);
            setProfiles(data);
            setCurrentIndex(0);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load profiles');
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (action: 'like' | 'pass' | 'superlike') => {
        if (!profiles[currentIndex]) return;

        const targetId = profiles[currentIndex].id;

        // Optimistic update
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        try {
            const result = await createSwipe(targetId, action);

            if (result.matched && result.matchId) {
                toast.success("It's a Match!", {
                    description: "You matched with " + profiles[currentIndex].name,
                    action: {
                        label: 'View',
                        onClick: () => router.push(`/match`)
                    }
                });
            }
        } catch (error) {
            console.error(error);
            // Optionally revert index if failed, but usually better to just log and move on
            toast.error('Failed to swipe');
        }
    };

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    const currentProfile = profiles[currentIndex];

    if (showFilters) return <FiltersView filters={filters} onApply={setFilters} onClose={() => setShowFilters(false)} />;

    if (loading) {
        return (
            <div className="h-screen w-full bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!currentProfile) {
        return (
            <div className="h-screen w-full bg-background-dark flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-surface-dark rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Icon name="search" className="text-4xl text-gray-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No more profiles</h2>
                <p className="text-gray-400 mb-8">Adjust your filters to see more people.</p>
                <button
                    onClick={() => setShowFilters(true)}
                    className="bg-primary text-black px-8 py-3 rounded-full font-bold"
                >
                    Adjust Filters
                </button>
                <CreateShout />
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full bg-background-dark flex flex-col overflow-hidden">
            <header className="absolute top-0 left-0 right-0 z-40 px-6 pt-12 pb-2 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <button onClick={() => setShowFilters(true)} className="p-2 rounded-full hover:bg-white/10 transition-colors pointer-events-auto">
                    <Icon name="tune" className="text-gray-300" />
                </button>
                <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center">
                        <span className="text-primary text-xs font-bold font-serif">S</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-primary font-serif">SUGR</h1>
                </div>
                <button className="p-2 rounded-full hover:bg-white/10 relative pointer-events-auto">
                    <Icon name="notifications" className="text-gray-300" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#f2cc0d]"></span>
                </button>
            </header>

            {/* Live Feed Ticker / Ads */}
            <div className="absolute top-24 left-0 right-0 z-30 px-4 pointer-events-none">
                <div className="flex flex-col gap-2">
                    <AnimatePresence>
                        {ads.slice(0, 2).map((ad) => (
                            <motion.div
                                key={ad.id}
                                initial={{ opacity: 0, y: -20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg pointer-events-auto"
                            >
                                <div className="flex gap-3">
                                    {ad.profiles?.avatar_url && (
                                        <img src={ad.profiles.avatar_url} className="w-10 h-10 rounded-full object-cover border border-[#F7E7CE]/50" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[#F7E7CE] font-serif text-sm truncate">{ad.profiles?.display_name || ad.profiles?.name || 'Anonymous'}</span>
                                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{ad.profiles?.tier}</span>
                                        </div>
                                        <p className="text-white text-xs line-clamp-2">{ad.content}</p>
                                    </div>
                                </div>
                                {ad.media_url && (
                                    <div className="mt-2 rounded-lg overflow-hidden h-32 relative">
                                        <img src={ad.media_url} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <main className="flex-1 relative flex flex-col justify-center items-center w-full h-full overflow-hidden">
                <div className="w-full max-w-md flex flex-col items-center justify-center px-4 pt-20 pb-24 h-full relative">

                    {/* Background Cards for stack effect */}
                    {profiles[currentIndex + 1] && (
                        <div className="absolute w-[80%] aspect-[3/4] max-h-[60vh] bg-surface-dark rounded-3xl opacity-40 transform scale-90 translate-y-12 shadow-xl border border-white/5 z-0"></div>
                    )}
                    {profiles[currentIndex + 1] && (
                        <div className="absolute w-[85%] aspect-[3/4] max-h-[60vh] bg-surface-dark rounded-3xl opacity-60 transform scale-95 translate-y-6 shadow-xl border border-white/5 z-10"></div>
                    )}

                    {/* Main Card */}
                    <div
                        onClick={() => handleNavigate(`/profile/${currentProfile.id}`)}
                        className="relative w-full aspect-[3/4] max-h-[60vh] z-20 group cursor-pointer rounded-3xl p-[1px] bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#aa771c] shadow-[0_0_30px_rgba(191,149,63,0.15)]"
                    >
                        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black">
                            <img
                                src={currentProfile.avatar_url || "https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1000&auto=format&fit=crop"}
                                alt={currentProfile.name || 'User'}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>

                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                <div className="flex gap-1">
                                    {/* Story indicators - placeholder for now */}
                                    <span className="h-1 w-8 bg-white/90 rounded-full shadow-lg"></span>
                                </div>
                                {currentProfile.lifestyle_tier && (
                                    <div className="px-3 py-1 glass-panel rounded-full flex items-center gap-1 border border-primary/20 shadow-lg">
                                        <Icon name="verified" className="text-primary text-[14px]" />
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-primary">{currentProfile.lifestyle_tier}</span>
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 glass-panel border-t-0 border-x-0 border-b-0 backdrop-blur-xl rounded-b-3xl">
                                <div className="px-5 pt-5 pb-5">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <h2 className="text-3xl font-bold text-white drop-shadow-md font-serif tracking-wide">{currentProfile.name}</h2>
                                                <span className="text-xl font-normal text-gray-200 font-serif">{currentProfile.age}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <div className="flex items-center gap-1 text-gold-light/80">
                                                    <Icon name="location_on" className="text-sm" />
                                                    <span className="text-sm font-serif italic tracking-wide">{currentProfile.city || 'Unknown Location'}</span>
                                                </div>
                                                <div className="w-px h-3 bg-white/20"></div>
                                                <div className="flex items-center gap-1 text-gold-light/80">
                                                    <Icon name="auto_awesome" className="text-sm" />
                                                    <span className="text-sm font-serif italic tracking-wide">{currentProfile.sugr_index || 85}% Match</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-primary/30 backdrop-blur-md">
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wide">{currentProfile.role}</span>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent my-3"></div>

                                    <div className="flex flex-wrap gap-2">
                                        {(currentProfile.interests || ["Travel", "Dining"]).slice(0, 3).map(tag => (
                                            <div key={tag} className="px-3 py-1.5 rounded-full bg-black/30 border border-white/5 flex items-center gap-1.5">
                                                <Icon name="local_activity" className="text-primary text-sm" />
                                                <span className="text-xs font-medium text-gray-200">{tag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - In Flow */}
                    <div className="mt-8 flex justify-center items-center gap-8 z-30">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleSwipe('pass'); }}
                            className="w-16 h-16 rounded-full bg-matte-black border border-white/5 shadow-lg flex items-center justify-center group active:scale-95 transition-all"
                        >
                            <Icon name="close" className="text-3xl text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSwipe('superlike');
                            }}
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-[0_0_20px_rgba(242,204,13,0.4)] flex items-center justify-center transform -translate-y-2 group active:scale-95 transition-all border-2 border-white/20"
                        >
                            <Icon name="star" className="text-3xl text-white drop-shadow-md" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleSwipe('like'); }}
                            className="w-16 h-16 rounded-full bg-primary/10 border border-primary/50 shadow-[0_0_20px_rgba(242,204,13,0.4)] flex items-center justify-center group active:scale-95 transition-all backdrop-blur-sm"
                        >
                            <Icon name="favorite" className="text-3xl text-primary drop-shadow-[0_0_8px_rgba(242,204,13,0.8)]" filled />
                        </button>
                    </div>
                </div>
            </main>

            <CreateShout />
        </div>
    );
};
