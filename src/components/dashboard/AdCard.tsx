'use client';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Ad } from '@/lib/services/ads';
import { formatDistanceToNow } from 'date-fns';

interface AdCardProps {
    ad: Ad;
    onClick: () => void;
}

export default function AdCard({ ad, onClick }: AdCardProps) {
    const timeLeft = formatDistanceToNow(new Date(ad.expires_at), { addSuffix: true }).replace('in ', '');
    const isUrgent = new Date(ad.expires_at).getTime() - Date.now() < 3600000 * 3; // Less than 3 hours

    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 0.98 }}
            className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden group cursor-pointer border-r border-b border-white/5"
        >
            {/* Background Image (Darkened) */}
            <div className="absolute inset-0 z-0">
                {ad.media_url ? (
                    <img
                        src={ad.media_url}
                        alt=""
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                    />
                ) : (
                    <div className="w-full h-full bg-[#0A0A0A]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
            </div>

            {/* BRUTALIST TYPOGRAPHY LAYER */}
            <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                {/* Header: Type & Time */}
                <div className="flex justify-between items-start">
                    <div className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest">
                        {ad.type}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-mono uppercase ${isUrgent ? 'text-red-500 animate-pulse' : 'text-white/40'}`}>
                        <Clock size={12} />
                        <span>{timeLeft} left</span>
                    </div>
                </div>

                {/* Main Content: Huge Type */}
                <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white leading-[0.9] uppercase tracking-tighter break-words line-clamp-4">
                        "{ad.content}"
                    </h3>

                    {/* User Mini-Dossier */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <img
                            src={ad.profile?.avatar_url || ''}
                            className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all border border-white/10"
                        />
                        <div>
                            <div className="text-sm font-bold text-white uppercase">{ad.profile?.name}</div>
                            <div className="text-[10px] text-white/50 uppercase tracking-wider flex items-center gap-2">
                                <span className="text-[#DC143C]">Idx {ad.profile?.sugr_index || 50}</span>
                                <span>•</span>
                                <span>{ad.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Action */}
            <div className="absolute bottom-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full">
                    <ArrowRight className="text-black" />
                </div>
            </div>
        </motion.div>
    );
}
