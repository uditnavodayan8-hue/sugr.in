'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, X } from 'lucide-react';
import { useSugr } from '@/context/SugrContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardHeader() {
    const { profile, notifications, unreadCount, clearNotifications } = useSugr();
    const [showNotifications, setShowNotifications] = useState(false);

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

            {/* Notifications Panel */}
            <AnimatePresence>
                {
                    showNotifications && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowNotifications(false)}
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
                    )
                }
            </AnimatePresence>
        </>
    );
}
