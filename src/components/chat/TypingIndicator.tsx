'use client';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
    name?: string;
}

export default function TypingIndicator({ name }: TypingIndicatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 px-4 py-2"
        >
            <div className="flex items-center gap-1 bg-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
                <motion.div
                    className="w-2 h-2 bg-white/40 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="w-2 h-2 bg-white/40 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                    className="w-2 h-2 bg-white/40 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
            </div>
            {name && (
                <span className="text-[10px] text-white/30 uppercase tracking-widest">
                    {name} is typing
                </span>
            )}
        </motion.div>
    );
}
