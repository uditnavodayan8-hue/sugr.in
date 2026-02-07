'use client';
import { useState } from 'react';
import { useDiscoveryProfiles } from '@/hooks/useDiscoveryProfiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import { ProfileCardSkeleton } from '@/components/dashboard/ProfileCardSkeleton';
import { motion } from 'framer-motion';
import { User, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BroadcastFeed from '@/components/dashboard/BroadcastFeed';
import { cn } from '@/lib/utils';

export default function Dashboard() {
    const { user } = useAuth();
    const { profiles, loading, error, hasMore, loadMore, refresh } = useDiscoveryProfiles();
    const [viewMode, setViewMode] = useState<'dossier' | 'broadcast'>('dossier');

    return (
        <main className="fixed inset-0 bg-[#0A0A0A] text-white overflow-hidden flex flex-col">
            {/* Minimal Header with Toggle */}
            <header className="absolute top-0 left-0 w-full pt-14 pb-4 z-50 pointer-events-none flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/5 pointer-events-auto"
                >
                    <button
                        onClick={() => setViewMode('dossier')}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all",
                            viewMode === 'dossier' ? "bg-white text-black" : "text-white/40 hover:text-white"
                        )}
                    >
                        Dossiers
                    </button>
                    <button
                        onClick={() => setViewMode('broadcast')}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all",
                            viewMode === 'broadcast' ? "bg-white text-black" : "text-white/40 hover:text-white"
                        )}
                    >
                        Broadcast
                    </button>
                </motion.div>
            </header>

            {viewMode === 'broadcast' ? (
                <div className="h-full w-full pt-20 overflow-y-auto no-scrollbar">
                    <BroadcastFeed />
                </div>
            ) : (
                /* Feed Container */
                <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
                    {/* Loading State */}
                    {loading && profiles.length === 0 && (
                        <section className="h-full w-full snap-start relative">
                            <ProfileCardSkeleton />
                            <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/10">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10"
                                >
                                    <Loader2 className="w-4 h-4 animate-spin text-white/70" />
                                    <span className="text-xs font-medium text-white/70">Finding matches...</span>
                                </motion.div>
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {!loading && profiles.length === 0 && (
                        <section className="h-full w-full snap-start flex flex-col items-center justify-center p-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center text-center max-w-[280px]"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <User className="w-7 h-7 text-white/30" strokeWidth={1.5} />
                                </div>
                                <h2 className="text-[22px] font-semibold text-white mb-2">No one nearby</h2>
                                <p className="text-[15px] text-white/40 leading-relaxed mb-8">
                                    We're curating profiles for you. Check back in a bit.
                                </p>
                                <motion.button
                                    onClick={refresh}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[15px] text-white/70 hover:bg-white/10 transition-colors"
                                >
                                    <RefreshCw size={16} />
                                    Refresh
                                </motion.button>
                            </motion.div>
                        </section>
                    )}

                    {/* Profile Cards */}
                    {profiles.map((profile) => (
                        <section key={profile.id} className="h-full w-full snap-start">
                            <ProfileCard profile={profile} />
                        </section>
                    ))}

                    {/* Load More */}
                    {hasMore && profiles.length > 0 && (
                        <section className="h-full w-full snap-start relative">
                            <ProfileCardSkeleton />
                        </section>
                    )}
                </div>
            )}
        </main>
    );
}
