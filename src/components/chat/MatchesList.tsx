'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMatches, Match } from '@/lib/services/matches';
import OnlineStatus from '@/components/ui/OnlineStatus';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

import Image from 'next/image';

export default function MatchesList() {
    const { user } = useAuth();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchMatches = async () => {
            try {
                const data = await getMatches(user.id);
                setMatches(data);
            } catch (err) {
                console.error('Failed to load matches:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [user]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white/20" />
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white/20" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">No matches yet</h2>
                    <p className="text-white/40 max-w-xs mx-auto">
                        Your matches will appear here. Start exploring to find people you connect with.
                    </p>
                </div>
                <Link
                    href="/dashboard"
                    className="px-6 py-3 bg-[#F7E7CE] text-black font-semibold rounded-full hover:scale-105 transition-transform"
                >
                    Start Swiping
                </Link>
            </div>
        );
    }

    const newMatches = matches.filter(m => !m.lastMessage);
    const activeMatches = matches.filter(m => m.lastMessage);

    return (
        <div className="flex-1 overflow-y-auto pb-24 touch-pan-y">
            <header className="px-6 py-6 border-b border-white/5 sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-md z-10">
                <h1 className="text-2xl font-bold text-white tracking-tight">Connections</h1>
            </header>

            <div className="space-y-6">
                {/* NEW MATCHES RAIL */}
                {newMatches.length > 0 && (
                    <div className="pt-6">
                        <h2 className="px-6 text-xs font-bold text-[#DC143C] uppercase tracking-widest mb-4">
                            New Matches
                        </h2>
                        <div className="flex gap-4 px-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {newMatches.map((match, i) => (
                                <Link
                                    key={match.id}
                                    href={`/chat?match=${match.id}&partner=${match.partner.id}`}
                                    className="flex-shrink-0 snap-start"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative group"
                                    >
                                        <div className="w-20 h-24 rounded-xl overflow-hidden relative border border-white/10 group-hover:border-[#DC143C]/50 transition-colors">
                                            <Image
                                                src={match.partner.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                                                alt={match.partner.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                                            {/* Name */}
                                            <div className="absolute bottom-2 left-0 w-full text-center px-1">
                                                <span className="text-[10px] font-bold text-white truncate block">
                                                    {match.partner.name}
                                                </span>
                                            </div>

                                            {/* Online Indicator */}
                                            <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-black shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* MESSAGES LIST */}
                <div>
                    <h2 className="px-6 text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                        Messages
                    </h2>
                    <div className="divide-y divide-white/5">
                        {activeMatches.length === 0 && newMatches.length > 0 ? (
                            <div className="px-6 py-8 text-center text-white/30 text-sm italic">
                                No messages yet. Start a conversation above!
                            </div>
                        ) : (
                            activeMatches.map((match, index) => (
                                <Link
                                    key={match.id}
                                    href={`/chat?match=${match.id}&partner=${match.partner.id}`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-white/10 relative">
                                                <Image
                                                    src={match.partner.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                                                    alt={match.partner.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            {/* Online Status (Mocked or Real) */}
                                            <div className="absolute bottom-0 right-1 p-0.5 bg-black rounded-full">
                                                <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-white truncate pr-2 group-hover:text-[#F7E7CE] transition-colors">
                                                    {match.partner.name}
                                                </h3>
                                                <span className="text-[10px] text-white/30 whitespace-nowrap font-mono">
                                                    {match.lastMessageTime && formatDistanceToNow(new Date(match.lastMessageTime), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "text-sm truncate transition-colors",
                                                match.isLastMessageMine ? "text-white/30 italic" : "text-white/60 group-hover:text-white/90"
                                            )}>
                                                {match.isLastMessageMine && <span className="mr-1">You:</span>}
                                                {match.lastMessage}
                                            </p>
                                            <div className="mt-1 flex gap-2">
                                                {/* Tags/Badges could go here */}
                                            </div>
                                        </div>

                                        <ChevronRight size={16} className="text-white/10 group-hover:text-white/30 transition-colors -mr-2" />
                                    </motion.div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
