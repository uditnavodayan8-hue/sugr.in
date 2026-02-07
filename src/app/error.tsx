'use client';
import { useEffect } from 'react';
import { WifiOff, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ErrorState({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <main className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-center text-white">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center max-w-[320px]"
            >
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <WifiOff size={32} className="text-white/40" />
                </div>

                <h2 className="text-[24px] font-semibold mb-2">Something went wrong</h2>
                <p className="text-[15px] text-white/50 leading-relaxed mb-8">
                    We're having trouble connecting. Please check your internet or try again.
                </p>

                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#F7E7CE] text-[#0A0A0A] font-semibold text-[15px] active:scale-95 transition-transform"
                >
                    <RotateCw size={18} />
                    Try Again
                </button>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left w-full">
                        <p className="text-[11px] font-mono text-red-300 break-all">
                            {error.message || JSON.stringify(error)}
                        </p>
                    </div>
                )}
            </motion.div>
        </main>
    );
}
