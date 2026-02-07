'use client';
import { useState } from 'react';
import { X, Smartphone, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabaseClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = getSupabaseClient();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    // Use /auth/confirm for client-side token handling (prevents email prefetch issues)
                    emailRedirectTo: `${window.location.origin}/auth/confirm`,
                }
            });

            if (error) throw error;
            setSent(true);
            toast.success('Magic Link Sent', {
                description: 'Check your email inbox for the access link.',
            });
        } catch (err: any) {
            console.error('Auth Error:', err);
            const msg = err.message || 'Failed to send link. Please try again.';
            setError(msg);
            toast.error('Authentication Failed', { description: msg });
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setSent(false);
        setOtp('');
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-sm relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-serif text-[#F7E7CE] mb-6 tracking-wide">Enter the Gate</h2>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-300">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {sent ? (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-[#F7E7CE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Smartphone size={32} className="text-[#F7E7CE]" />
                        </div>

                        <div>
                            <h3 className="text-white text-lg font-bold mb-2">Check your email</h3>
                            <p className="text-zinc-400 text-sm">We sent a secure access link to <span className="text-white">{email}</span></p>
                        </div>

                        <p className="text-zinc-500 text-xs">Click the link in the email to sign in.</p>

                        <button
                            type="button"
                            onClick={resetFlow}
                            className="w-full text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-widest mt-4"
                        >
                            Use different email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="private@example.com"
                                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#F7E7CE] outline-none"
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full py-3 bg-[#F7E7CE] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Get Login Code'} <ArrowRight size={14} />
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-600">Or</span></div>
                        </div>

                        <button
                            type="button"
                            className="w-full py-3 bg-zinc-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Smartphone size={16} /> Login with Phone
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
