'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import SwipeFeed from './SwipeFeed';
import BroadcastFeed from './BroadcastFeed';
import DailyPicks from './DailyPicks';
import ProfilePictureModal from './ProfilePictureModal';
import { Profile } from '@/lib/services/profiles';
import { DailyPick } from '@/lib/services/curation';
import { Activity, Radio, Plus, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardContentProps {
    initialProfiles: Profile[];
    currentUserId: string;
    streak?: number;
    dailyPicks?: DailyPick[];
    userHasAvatar?: boolean;
}

export default function DashboardContent({
    initialProfiles,
    currentUserId,
    streak = 0,
    dailyPicks = [],
    userHasAvatar = true
}: DashboardContentProps) {
    const [activeTab, setActiveTab] = useState<'discover' | 'broadcasts'>('discover');
    const [showPfpModal, setShowPfpModal] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);

    // Show PFP modal if user has no avatar (first time)
    useEffect(() => {
        if (!userHasAvatar) {
            setShowPfpModal(true);
        }
    }, [userHasAvatar]);

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

            {/* FLOATING ACTION BUTTONS */}
            <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3">
                {/* Post Broadcast Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBroadcastModal(true)}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                >
                    <Plus size={24} className="text-white" />
                </motion.button>

                {/* Update Profile Picture */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPfpModal(true)}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20"
                >
                    <Camera size={20} className="text-white/70" />
                </motion.button>
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

            {/* MODALS */}
            <AnimatePresence>
                {showPfpModal && (
                    <ProfilePictureModal
                        userId={currentUserId}
                        onComplete={() => setShowPfpModal(false)}
                        onSkip={() => setShowPfpModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* Broadcast Modal - Simple Input for now */}
            <AnimatePresence>
                {showBroadcastModal && (
                    <BroadcastPostModal
                        userId={currentUserId}
                        onClose={() => setShowBroadcastModal(false)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}

// Simple Broadcast Post Modal Component
function BroadcastPostModal({ userId, onClose }: { userId: string; onClose: () => void }) {
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);

    const handlePost = async () => {
        if (!content.trim()) return;
        setPosting(true);

        try {
            const res = await fetch('/api/broadcasts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, user_id: userId })
            });

            if (res.ok) {
                onClose();
                window.location.reload(); // Simple refresh to show new broadcast
            }
        } catch (error) {
            console.error('Failed to post:', error);
        } finally {
            setPosting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 rounded-3xl p-6 max-w-md w-full border border-white/10"
            >
                <h2 className="text-xl font-serif mb-4">Post a Signal</h2>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={4}
                    maxLength={280}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none resize-none mb-4"
                />

                <div className="flex justify-between items-center">
                    <span className="text-white/30 text-xs">{content.length}/280</span>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-white/50 hover:text-white text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePost}
                            disabled={!content.trim() || posting}
                            className="px-6 py-2 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-full disabled:opacity-50"
                        >
                            {posting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
