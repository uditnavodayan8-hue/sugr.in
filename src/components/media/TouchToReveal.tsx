'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TouchToRevealProps {
    src: string;
    alt?: string;
    className?: string;
    blurAmount?: number;
    /** If true, requires press-and-hold to reveal */
    holdToReveal?: boolean;
}

/**
 * Privacy-first media component.
 * Images remain blurred until onMouseDown/onTouchStart is triggered.
 * Releases blur on mouse/touch up.
 */
export default function TouchToReveal({
    src,
    alt = 'Private media',
    className,
    blurAmount = 20,
    holdToReveal = true,
}: TouchToRevealProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleRevealStart = () => {
        if (holdToReveal) {
            // Start reveal after small delay to prevent accidental reveals
            timeoutRef.current = setTimeout(() => {
                setIsRevealed(true);
            }, 150);
        } else {
            setIsRevealed(true);
        }
    };

    const handleRevealEnd = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (holdToReveal) {
            setIsRevealed(false);
        }
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl cursor-pointer select-none",
                className
            )}
            onMouseDown={handleRevealStart}
            onMouseUp={handleRevealEnd}
            onMouseLeave={handleRevealEnd}
            onTouchStart={handleRevealStart}
            onTouchEnd={handleRevealEnd}
            onContextMenu={(e) => e.preventDefault()} // Prevent right-click save
        >
            {/* The Image */}
            <motion.img
                src={src}
                alt={alt}
                draggable={false}
                onLoad={() => setIsLoaded(true)}
                animate={{
                    filter: isRevealed ? 'blur(0px)' : `blur(${blurAmount}px)`,
                    scale: isRevealed ? 1 : 1.1,
                }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
            />

            {/* Loading State */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
            )}

            {/* Overlay when blurred */}
            <motion.div
                animate={{ opacity: isRevealed ? 0 : 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 pointer-events-none"
            >
                <div className="flex flex-col items-center gap-2 text-white/70">
                    <Lock size={24} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">
                        {holdToReveal ? 'Hold to reveal' : 'Tap to reveal'}
                    </span>
                </div>
            </motion.div>

            {/* Revealed indicator */}
            <motion.div
                animate={{ opacity: isRevealed ? 1 : 0 }}
                className="absolute top-3 right-3 pointer-events-none"
            >
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                    <Eye size={12} className="text-emerald-400" />
                    <span className="text-[8px] text-white/70 uppercase tracking-wider">Live</span>
                </div>
            </motion.div>
        </div>
    );
}
