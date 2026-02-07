'use client';
import { useState } from 'react';
import { X, ArrowRight, AlertCircle, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabaseClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = getSupabaseClient();

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const trimmedEmail = email.trim().toLowerCase();
        setEmail(trimmedEmail);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: trimmedEmail,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: `${window.location.origin}/auth/confirm`,
                }
            });

            if (error) throw error;
            setSent(true);
            toast.success('Magic Link Sent!', {
                description: 'Check your email and click the link to sign in.',
            });
        } catch (err: any) {
            console.error('Auth Error:', err);
            const msg = err.message || 'Failed to send link. Please try again.';
            setError(msg);
            toast.error('Failed to send link', { description: msg });
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setSent(false);
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
                    <div className="space-y-6 text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>

                        <div>
                            <h3 className="text-white text-lg font-bold mb-2">Check Your Email</h3>
                            <p className="text-zinc-400 text-sm">
                                We sent a login link to<br />
                                <span className="text-white font-medium">{email}</span>
                            </p>
                        </div>

                        <div className="bg-zinc-800/50 p-4 rounded-xl">
                            <p className="text-zinc-300 text-xs">
                                📧 Click the <strong>magic link</strong> in the email to sign in instantly.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={resetFlow}
                            className="w-full text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-widest mt-4"
                        >
                            Use different email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSendMagicLink} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
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
                            {loading ? (
                                <span className="animate-pulse">Sending...</span>
                            ) : (
                                <>Send Magic Link <Mail size={14} /></>
                            )}
                        </button>

                        <p className="text-center text-zinc-500 text-[10px] mt-4">
                            No password needed. We'll email you a secure link.
                        </p>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
