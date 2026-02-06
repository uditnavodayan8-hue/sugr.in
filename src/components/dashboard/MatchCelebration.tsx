'use client';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/lib/services/profiles';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface MatchCelebrationProps {
    partner: Profile;
    onClose: () => void;
}

export default function MatchCelebration({ partner, onClose }: MatchCelebrationProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
        setMounted(true);
    }, []);

    const handleMessage = () => {
        router.push('/chat');
    };

    // Confetti particles
    const particles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: -20,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: ['#F7E7CE', '#FFFFFF', '#FFD700'][Math.floor(Math.random() * 3)]
    }));

    if (!mounted || typeof document === 'undefined') return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
        >
            {/* Confetti */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: -20, x: p.x, rotate: p.rotation, scale: p.scale }}
                    animate={{
                        y: dimensions.height + 20,
                        rotate: p.rotation + 360,
                        x: p.x + (Math.random() - 0.5) * 200
                    }}
                    transition={{
                        duration: Math.random() * 2 + 2,
                        ease: "linear",
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{ backgroundColor: p.color }}
                />
            ))}

            <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
                {/* Title */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7CE] to-white italic font-serif">
                        It&apos;s a Match!
                    </h1>
                    <p className="text-white/60 mt-2">You and {partner.name} like each other</p>
                </motion.div>

                {/* Avatars */}
                <div className="flex items-center justify-center gap-4 mb-16 relative">
                    {/* User Avatar */}
                    <motion.div
                        initial={{ x: -100, opacity: 0, rotate: -20 }}
                        animate={{ x: 0, opacity: 1, rotate: -10 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                    >
                        <img
                            src={user?.user_metadata?.avatar_url || 'https://via.placeholder.com/150'}
                            className="w-full h-full object-cover"
                            alt="You"
                        />
                    </motion.div>

                    {/* Heart Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
                        transition={{ delay: 0.6, type: "spring" }}
                        className="absolute z-20 bg-white rounded-full p-3 shadow-xl"
                    >
                        <div className="bg-gradient-to-tr from-[#F7E7CE] to-[#e6d0ac] rounded-full p-2">
                            <MessageCircle size={32} className="text-black fill-black/20" />
                        </div>
                    </motion.div>

                    {/* Partner Avatar */}
                    <motion.div
                        initial={{ x: 100, opacity: 0, rotate: 20 }}
                        animate={{ x: 0, opacity: 1, rotate: 10 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="w-32 h-32 rounded-full border-4 border-[#F7E7CE] overflow-hidden shadow-[0_0_50px_rgba(247,231,206,0.2)]"
                    >
                        <img
                            src={partner.avatar_url || 'https://via.placeholder.com/150'}
                            className="w-full h-full object-cover"
                            alt={partner.name}
                        />
                    </motion.div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 w-full">
                    <motion.button
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={handleMessage}
                        className="w-full py-4 bg-[#F7E7CE] text-black font-bold rounded-full text-lg shadow-[0_4px_20px_rgba(247,231,206,0.3)] hover:scale-105 active:scale-95 transition-transform"
                    >
                        Send a Message
                    </motion.button>

                    <motion.button
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        onClick={onClose}
                        className="w-full py-4 bg-white/10 text-white font-medium rounded-full text-lg hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm"
                    >
                        Keep Swiping
                    </motion.button>
                </div>
            </div>
        </motion.div>,
        document.body
    );
}
