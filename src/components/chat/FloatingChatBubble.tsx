'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FloatingChatBubbleProps {
    matchId: string;
    partnerName: string;
    partnerAvatar?: string;
}

export default function FloatingChatBubble({
    matchId,
    partnerName,
    partnerAvatar
}: FloatingChatBubbleProps) {
    const router = useRouter();

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push(`/chat?match=${matchId}`)}
            className="fixed bottom-28 right-6 z-50 group"
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[#F7E7CE] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />

            {/* Bubble */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#F7E7CE] to-[#D4C4A8] shadow-2xl flex items-center justify-center">
                {partnerAvatar ? (
                    <img
                        src={partnerAvatar}
                        alt={partnerName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
                    />
                ) : (
                    <MessageCircle size={28} className="text-[#0A0A0A]" strokeWidth={2} />
                )}

                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-[#F7E7CE] animate-ping opacity-30" />
            </div>

            {/* Label */}
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1C1C1E] rounded-lg whitespace-nowrap"
            >
                <span className="text-[13px] text-white">Message {partnerName}</span>
            </motion.div>
        </motion.button>
    );
}
