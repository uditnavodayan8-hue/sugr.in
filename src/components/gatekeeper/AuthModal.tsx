'use client';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-[400px] relative"
            >
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors p-2"
                >
                    <X size={24} />
                </button>

                <div className="bg-[#050505] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                    <SignIn
                        appearance={{
                            baseTheme: dark,
                            variables: {
                                colorPrimary: '#F7E7CE', // Gold/Beige
                                colorBackground: '#050505',
                                colorText: '#ffffff',
                                colorTextSecondary: '#a1a1aa',
                                colorInputBackground: '#18181b', // Zinc-900
                                colorInputText: '#ffffff',
                                borderRadius: '0.75rem',
                            },
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent shadow-none p-6",
                                headerTitle: "text-2xl font-serif text-[#F7E7CE] tracking-wider",
                                headerSubtitle: "text-zinc-500 text-[10px] uppercase tracking-widest",
                                socialButtonsBlockButton: "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white",
                                socialButtonsBlockButtonText: "text-white font-sans",
                                dividerLine: "bg-zinc-800",
                                dividerText: "text-zinc-500 uppercase text-[10px] tracking-widest",
                                formFieldInput: "bg-black border-zinc-800 focus:border-[#F7E7CE] transition-colors",
                                formButtonPrimary: "bg-[#F7E7CE] text-black hover:bg-white font-bold uppercase tracking-widest text-xs py-3",
                                footerActionLink: "text-[#F7E7CE] hover:text-white",
                                identityPreviewText: "text-white",
                                identityPreviewEditButton: "text-[#F7E7CE]",
                            }
                        }}
                        redirectUrl="/dashboard"
                        signUpUrl="/onboarding"
                    />
                </div>
            </motion.div>
        </div>
    );
}