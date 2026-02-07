'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Bell, User, X, Send } from 'lucide-react';
import { useSugr } from '@/context/SugrContext';
import { postAd } from '@/app/actions/ads';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardHeader() {
    const { profile, notifications, unreadCount, clearNotifications } = useSugr();
    const [showPostAd, setShowPostAd] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [adContent, setAdContent] = useState('');
    const [adTier, setAdTier] = useState<'executive' | 'elite' | 'premium'>('executive');
    const [posting, setPosting] = useState(false);

    const handlePostAd = async () => {
        if (!adContent.trim()) return;

        setPosting(true);
        try {
            const result = await postAd({ content: adContent, tier: adTier });
            if (result.success) {
                toast.success('Broadcast live!', { description: 'Your ad is now visible to others.' });
                setAdContent('');
                setShowPostAd(false);
            } else {
                toast.error('Failed to post', { description: result.error });
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setPosting(false);
        }
    };

    return (
        <>
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent">
                <div className="flex items-center justify-between px-4 py-4">
                    {/* Logo */}
                    <Link href="/dashboard" className="text-lg font-serif italic text-white">
                        sugr.
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Post Ad Button */}
                        <motion.button
                            onClick={() => setShowPostAd(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full bg-white text-black"
                        >
                            <Plus size={20} />
                        </motion.button>

                        {/* Notifications */}
                        <button
                            onClick={() => setShowNotifications(true)}
                            className="relative p-2 rounded-full bg-white/10"
                        >
                            <Bell size={20} className="text-white" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Profile */}
                        <Link href="/profile" className="p-2 rounded-full bg-white/10">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                            ) : (
                                <User size={20} className="text-white" />
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Post Ad Modal */}
            <AnimatePresence>
                {showPostAd && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPostAd(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-white/10 rounded-t-3xl p-6 space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white">New Broadcast</h2>
                                <button onClick={() => setShowPostAd(false)} className="text-white/50">
                                    <X size={20} />
                                </button>
                            </div>

                            <textarea
                                value={adContent}
                                onChange={(e) => setAdContent(e.target.value)}
                                placeholder="What are you looking for tonight?"
                                rows={3}
                                maxLength={280}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none resize-none"
                            />

                            <div className="flex gap-2">
                                {(['executive', 'elite', 'premium'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setAdTier(t)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                            adTier === t
                                                ? "bg-white text-black"
                                                : "bg-white/5 text-white/60 hover:bg-white/10"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <motion.button
                                onClick={handlePostAd}
                                disabled={posting || !adContent.trim()}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {posting ? 'Posting...' : <><Send size={16} /> Go Live</>}
                            </motion.button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Notifications Panel */}
            <AnimatePresence>
                {showNotifications && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setShowNotifications(false); clearNotifications(); }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 bottom-0 w-80 z-50 bg-zinc-900 border-l border-white/10 p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white">Notifications</h2>
                                <button onClick={() => { setShowNotifications(false); clearNotifications(); }} className="text-white/50">
                                    <X size={20} />
                                </button>
                            </div>

                            {notifications.length === 0 ? (
                                <p className="text-white/40 text-sm">No new notifications</p>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.map((n) => (
                                        <div key={n.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-sm text-white">
                                                {n.status === 'pending' ? 'New access request' :
                                                    n.status === 'granted' ? 'Your request was granted!' :
                                                        'Your request was denied'}
                                            </p>
                                            <p className="text-xs text-white/40 mt-1">
                                                {new Date(n.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
