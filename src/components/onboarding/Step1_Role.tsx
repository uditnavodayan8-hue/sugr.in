'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step1_RoleProps {
    onSelect: (role: 'provider' | 'protege') => void;
}

export default function Step1_Role({ onSelect }: Step1_RoleProps) {
    const [hoveredRole, setHoveredRole] = useState<'provider' | 'protege' | null>(null);
    const [selectedRole, setSelectedRole] = useState<'provider' | 'protege' | null>(null);

    const handleSelect = (role: 'provider' | 'protege') => {
        setSelectedRole(role);
        // Delay to allow animation to play
        setTimeout(() => {
            onSelect(role);
        }, 800);
    };

    return (
        <div className="absolute inset-0 flex flex-col md:flex-row bg-black overflow-hidden">
            {/* Background Videos Layer */}
            <div className="absolute inset-0 z-0">
                {/* Default Ambient Video (when nothing hovered) */}
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: hoveredRole ? 0 : 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <video
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover opacity-30 grayscale"
                        src="https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4" // Neutral Night City
                    />
                </motion.div>

                {/* Provider Video (Crimson/Gold) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredRole === 'provider' ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 to-transparent mix-blend-multiply z-10" />
                    <video
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover"
                        src="https://videos.pexels.com/video-files/3253209/3253209-hd_1920_1080_25fps.mp4" // City skyline/Luxury
                    />
                </motion.div>

                {/* Protégé Video (Noir/Silver) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredRole === 'protege' ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent mix-blend-multiply z-10" />
                    <video
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover grayscale contrast-125"
                        src="https://videos.pexels.com/video-files/5532768/5532768-hd_1920_1080_25fps.mp4" // Fashion/Model pose
                    />
                </motion.div>

                {/* Grain Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay z-20" />
            </div>

            {/* Split Screen Interaction Layer */}

            {/* PROVIDER SIDE */}
            <div
                className="relative z-30 flex-1 flex flex-col items-center justify-center p-8 cursor-pointer group border-b md:border-b-0 md:border-r border-white/10 hover:bg-black/20 transition-colors"
                onMouseEnter={() => setHoveredRole('provider')}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => handleSelect('provider')}
            >
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: hoveredRole === 'provider' ? 1.1 : 1,
                            borderColor: hoveredRole === 'provider' ? '#F7E7CE' : 'rgba(255,255,255,0.2)'
                        }}
                        className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center mb-6 bg-black/40 backdrop-blur-sm"
                    >
                        <Shield size={40} className={cn("transition-colors duration-500", hoveredRole === 'provider' ? "text-[#F7E7CE]" : "text-white")} />
                    </motion.div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className={cn("text-4xl font-serif tracking-tight transition-colors duration-500", hoveredRole === 'provider' ? "text-[#F7E7CE]" : "text-white")}>
                        Provider
                    </h2>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Benefactor & Mentor</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: hoveredRole === 'provider' ? 1 : 0, height: hoveredRole === 'provider' ? 'auto' : 0 }}
                    className="mt-6 max-w-xs text-center overflow-hidden"
                >
                    <p className="text-sm text-white/80 font-light leading-relaxed">
                        You have reached a level of success that allows you to offer guidance and experiences to those with ambition.
                    </p>
                </motion.div>
            </div>

            {/* PROTEGE SIDE */}
            <div
                className="relative z-30 flex-1 flex flex-col items-center justify-center p-8 cursor-pointer group hover:bg-black/20 transition-colors"
                onMouseEnter={() => setHoveredRole('protege')}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => handleSelect('protege')}
            >
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: hoveredRole === 'protege' ? 1.1 : 1,
                            borderColor: hoveredRole === 'protege' ? '#E9D5FF' : 'rgba(255,255,255,0.2)'
                        }}
                        className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center mb-6 bg-black/40 backdrop-blur-sm"
                    >
                        <Star size={40} className={cn("transition-colors duration-500", hoveredRole === 'protege' ? "text-purple-200" : "text-white")} />
                    </motion.div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className={cn("text-4xl font-serif tracking-tight transition-colors duration-500", hoveredRole === 'protege' ? "text-purple-200" : "text-white")}>
                        Protégé
                    </h2>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Muse & Companion</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: hoveredRole === 'protege' ? 1 : 0, height: hoveredRole === 'protege' ? 'auto' : 0 }}
                    className="mt-6 max-w-xs text-center overflow-hidden"
                >
                    <p className="text-sm text-white/80 font-light leading-relaxed">
                        You possess beauty and ambition, seeking a mentor who can open doors to a higher echelon of life.
                    </p>
                </motion.div>
            </div>

            {/* Selection Overlay Animation */}
            <AnimatePresence>
                {selectedRole && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-black flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                                <Check size={40} className="text-black" />
                            </div>
                            <h3 className="text-2xl font-serif text-white">Confirmed</h3>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
