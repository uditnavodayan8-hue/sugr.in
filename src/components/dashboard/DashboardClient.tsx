'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Loader2, RefreshCw } from 'lucide-react';
import ProfileCard from '@/components/dashboard/ProfileCard';
import { ProfileCardSkeleton } from '@/components/dashboard/ProfileCardSkeleton';
import BroadcastFeed from '@/components/dashboard/BroadcastFeed';
import { cn } from '@/lib/utils';
import ProfileDossier from '@/components/ProfileDossier';

interface DashboardClientProps {
    initialProfiles: any[];
    userRole: string | null;
}

export default function DashboardClient({ initialProfiles, userRole }: DashboardClientProps) {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [viewMode, setViewMode] = useState<'dossier' | 'broadcast'>('dossier');
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        // Implement refresh logic here if needed, or just reload the page for server refresh
        window.location.reload();
    };

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
                <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar pt-20 pb-20">

                    {/* Empty State */}
                    {profiles.length === 0 && (
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
                                    onClick={handleRefresh}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[15px] text-white/70 hover:bg-white/10 transition-colors"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                                    Refresh
                                </motion.button>
                            </motion.div>
                        </section>
                    )}

                    {/* Profile Cards */}
                    {profiles.map((profile) => (
                        <section key={profile.id} className="h-full w-full snap-start flex items-center justify-center p-4">
                            {/* Use ProfileDossier or ProfileCard? User asked for ProfileDossier */}
                            <ProfileDossier userId={profile.id} className="w-full max-w-md h-auto max-h-full" />
                            {/* Or render ProfileCard if it's the intended swipe card. 
                                The user said "ProfileDossier ... displays their 'Stalkable' info".
                                The old dashboard used ProfileCard. I'll use ProfileDossier as requested for the overhaul.
                            */}
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}
