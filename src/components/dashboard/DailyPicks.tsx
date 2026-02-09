'use client';

import { DailyPick } from '@/lib/services/curation';
import { motion } from 'framer-motion';
import { Clock, Star, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';

interface DailyPicksProps {
    picks: DailyPick[];
}

export default function DailyPicks({ picks }: DailyPicksProps) {
    if (!picks || picks.length === 0) return null;

    return (
        <div className="w-full py-6 pl-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-[#F7E7CE]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Daily Picks</h3>
                <span className="text-[10px] text-white/30 px-2 py-0.5 rounded border border-white/10">
                    Resets in 24h
                </span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 pr-4 scrollbar-hide snap-x">
                {picks.map((pick, i) => (
                    <Link href={`/profile/${pick.profile.id}`} key={pick.id} className="snap-center">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative w-32 h-48 rounded-xl overflow-hidden bg-white/5 border border-white/10 group flex-shrink-0"
                        >
                            {/* Image */}
                            <img
                                src={pick.profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                                alt={pick.profile.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-3">
                                <h4 className="text-sm font-bold text-white truncate">{pick.profile.name}</h4>
                                <p className="text-[10px] text-white/60 truncate">{pick.profile.city}</p>
                            </div>

                            {/* Badge */}
                            <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 rounded-full bg-[#F7E7CE] flex items-center justify-center shadow-[0_0_10px_#F7E7CE]">
                                    <Star size={12} className="text-black fill-black" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
