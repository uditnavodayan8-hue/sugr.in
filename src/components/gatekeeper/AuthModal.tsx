'use client';

import { AnimatePresence, motion } from 'framer-motion';
import NoirAuth from '@/components/auth/NoirAuth';
import { X } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black"
            >
                <div className="absolute top-4 right-4 z-50">
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <NoirAuth />
            </motion.div>
        </AnimatePresence>
    );
}

