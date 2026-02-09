'use client'

import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSignedUrl } from '@/actions/storage'
import { motion, AnimatePresence } from 'framer-motion'

interface MediaGuardProps {
    filePath: string
    alt?: string
    className?: string
    blurAmount?: 'sm' | 'md' | 'lg' | 'xl'
}

export function MediaGuard({ filePath, alt = "Protected Content", className, blurAmount = 'lg' }: MediaGuardProps) {
    const [signedUrl, setSignedUrl] = useState<string | null>(null)
    const [isRevealed, setIsRevealed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Fetch signed URL on mount or when revealed? 
    // For maximum security, we might only fetch when user intends to view, 
    // but for UX, pre-fetching might be better. 
    // Let's pre-fetch but keep it blurred.
    useEffect(() => {
        let mounted = true
        const fetchUrl = async () => {
            const url = await getSignedUrl(filePath)
            if (mounted && url) setSignedUrl(url)
        }
        fetchUrl()
        return () => { mounted = false }
    }, [filePath])

    const handleInteractionStart = () => setIsRevealed(true)
    const handleInteractionEnd = () => setIsRevealed(false)

    return (
        <div
            className={cn("relative overflow-hidden group select-none", className)}
            onMouseDown={handleInteractionStart}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
        >
            {/* The Image (Hidden or Visible) */}
            {signedUrl ? (
                <img
                    src={signedUrl}
                    alt={alt}
                    className={cn(
                        "w-full h-full object-cover transition-all duration-300",
                        isRevealed ? "blur-0 scale-100" : "blur-xl scale-110 opacity-50 grayscale"
                    )}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()} // Prevent right-click save
                />
            ) : (
                <div className="w-full h-full bg-zinc-900 animate-pulse flex items-center justify-center">
                    <Lock className="w-6 h-6 text-zinc-700" />
                </div>
            )}

            {/* Overlay Instructions */}
            <AnimatePresence>
                {!isRevealed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full border border-white/10 mb-2">
                            <Lock className="w-5 h-5 text-white/70" />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-mono">
                            Hold to Reveal
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Security Watermark (Optional) */}
            {isRevealed && (
                <div className="absolute bottom-2 right-2 text-[8px] text-white/20 font-mono uppercase pointer-events-none">
                    sugr. secured
                </div>
            )}
        </div>
    )
}
