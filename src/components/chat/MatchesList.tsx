'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMatches, Match } from '@/lib/services/matches';
import OnlineStatus from '@/components/ui/OnlineStatus';
import { formatDistanceToNow } from 'date-fns';

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

    return (
        <div className="flex-1 overflow-y-auto pb-24">
            <header className="px-6 py-6 border-b border-white/5 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10">
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <p className="text-white/40 text-sm mt-1">
                    {matches.length} {matches.length === 1 ? 'connection' : 'connections'}
                </p>
            </header>

            <div className="divide-y divide-white/5">
                {matches.map((match, index) => (
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
                                <img
                                    src={match.partner.avatar_url || ''}
                                    alt={match.partner.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-white/20 transition-colors"
                                />
                                <div className="absolute bottom-0 right-0 p-0.5 bg-black rounded-full">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-white truncate pr-2">
                                        {match.partner.name}
                                    </h3>
                                    <span className="text-[10px] text-white/30 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(match.lastMessageTime || new Date()), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-white/50 truncate group-hover:text-white/70 transition-colors">
                                    {match.lastMessage || 'Start a conversation...'}
                                </p>
                            </div>

                            <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
