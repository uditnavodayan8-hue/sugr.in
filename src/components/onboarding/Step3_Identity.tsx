'use client';

import { motion } from 'framer-motion';
import { Shield, Camera, Upload, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Step3_IdentityProps {
    loading: boolean;
    onInitiate: () => void;
}

export default function Step3_Identity({ loading, onInitiate }: Step3_IdentityProps) {
    const router = useRouter();

    return (
        <motion.div
            key="verify"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg space-y-8"
        >
            <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Shield size={32} className="text-emerald-400" />
                </div>
                <h1 className="text-3xl font-serif italic">Identity Anchor</h1>
                <p className="text-white/40 text-sm max-w-xs mx-auto">
                    Verify your identity to unlock full access. This keeps our community safe.
                </p>
            </div>

            <div className="space-y-4">
                {/* Verification Options */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center gap-3">
                        <Camera size={20} className="text-white/50" />
                        <div>
                            <p className="text-sm font-bold">Photo Verification</p>
                            <p className="text-xs text-white/40">Take a selfie to prove you're real</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Upload size={20} className="text-white/50" />
                        <div>
                            <p className="text-sm font-bold">ID Verification</p>
                            <p className="text-xs text-white/40">Upload a government ID (optional)</p>
                        </div>
                    </div>
                </div>

                {/* Initiate */}
                <button
                    type="button"
                    onClick={onInitiate}
                    disabled={loading}
                    className="w-full py-4 bg-emerald-500 text-black font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                    {loading ? (
                        <span className="animate-pulse">Verifying...</span>
                    ) : (
                        <>
                            <Check size={16} /> Start Verification
                        </>
                    )}
                </button>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full text-center text-white/40 text-xs hover:text-white/60"
                >
                    Skip for now (limited access)
                </button>
            </div>
        </motion.div>
    );
}
