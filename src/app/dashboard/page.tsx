'use client';
import { useDiscoveryProfiles } from '@/hooks/useDiscoveryProfiles';
import ProfileCard from '@/components/dashboard/ProfileCard';
import { motion } from 'framer-motion';
import { User, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const { profiles, loading, error, hasMore, loadMore, refresh } = useDiscoveryProfiles();

    return (
        <main className="fixed inset-0 bg-[#0A0A0A] text-white overflow-hidden">
            {/* Minimal Header - Apple Style */}
            <header className="absolute top-0 left-0 w-full px-8 pt-14 pb-4 z-50 pointer-events-none">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[17px] font-semibold text-center text-white/90 tracking-tight"
                >
                    Discover
                </motion.h1>
            </header>

            {/* Feed Container */}
            <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">

                {/* Loading State */}
                {loading && profiles.length === 0 && (
                    <section className="h-full w-full snap-start flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-[#F7E7CE]" />
                            </div>
                            <p className="text-[15px] text-white/40">Finding people for you...</p>
                        </motion.div>
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
                    <section className="h-full w-full snap-start flex items-center justify-center">
                        <motion.button
                            onClick={loadMore}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-[#F7E7CE]" />
                            </div>
                            <span className="text-[13px] text-white/40">Loading more</span>
                        </motion.button>
                    </section>
                )}
            </div>
        </main>
    );
}
