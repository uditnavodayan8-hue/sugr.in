'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EyeOff } from 'lucide-react';

export default function PrivacyShimmer() {
    const [isObscured, setIsObscured] = useState(false);

    useEffect(() => {
        const handleBlur = () => setIsObscured(true);
        const handleFocus = () => setIsObscured(false);

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        // Optional: Inactivity timer?
        // For now, window blur is the primary trigger for "Shoulder Surfing" protection.

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    return (
        <AnimatePresence>
            {isObscured && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                            <EyeOff size={40} className="text-white/20" strokeWidth={1} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white/40 uppercase tracking-tight">Zero-Trace Active</h2>
                            <p className="text-xs text-white/20 font-mono uppercase tracking-widest">
                                Content obscured for privacy.
                            </p>
                        </div>
                        <div className="w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
