'use client';

import { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import SwipeFeed from './SwipeFeed';
import BroadcastFeed from './BroadcastFeed';
import DailyPicks from './DailyPicks';
import { Profile } from '@/lib/services/profiles';
import { DailyPick } from '@/lib/services/curation';
import { Activity, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DashboardContentProps {
    initialProfiles: Profile[];
    currentUserId: string;
    streak?: number;
    dailyPicks?: DailyPick[];
}

export default function DashboardContent({ initialProfiles, currentUserId, streak = 0, dailyPicks = [] }: DashboardContentProps) {
    const [activeTab, setActiveTab] = useState<'discover' | 'broadcasts'>('discover');

    return (
        <main className="relative h-screen overflow-hidden bg-black text-white">
            <DashboardHeader streak={streak} />

            {/* TAB CONTENT */}
            <div className="absolute inset-0 top-16 pb-20 overflow-y-auto scrollbar-hide">
                {activeTab === 'discover' ? (
                    <>
                        <DailyPicks picks={dailyPicks} />
                        <SwipeFeed initialProfiles={initialProfiles} currentUserId={currentUserId} />
                    </>
                ) : (
                    <BroadcastFeed currentUserId={currentUserId} />
                )}
            </div>

            {/* BOTTOM TAB BAR */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md px-2 py-2 rounded-full border border-white/10 flex items-center gap-1 shadow-2xl">
                <button
                    onClick={() => setActiveTab('discover')}
                    className={cn(
                        "relative px-4 py-2 rounded-full flex items-center gap-2 transition-all",
                        activeTab === 'discover' ? "bg-white text-black" : "text-white/50 hover:text-white"
                    )}
                >
                    <Activity size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Discover</span>
                    {activeTab === 'discover' && (
                        <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-full -z-10" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('broadcasts')}
                    className={cn(
                        "relative px-4 py-2 rounded-full flex items-center gap-2 transition-all",
                        activeTab === 'broadcasts' ? "bg-white text-black" : "text-white/50 hover:text-white"
                    )}
                >
                    <Radio size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Signals</span>
                    {activeTab === 'broadcasts' && (
                        <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-full -z-10" />
                    )}
                </button>
            </div>
        </main>
    );
}
