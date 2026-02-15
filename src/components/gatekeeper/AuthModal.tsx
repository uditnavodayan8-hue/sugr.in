'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowRight, Check, Mail } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            setSent(true);
            toast.success('Magic link sent!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to send link. Try again.');
        } finally {
            setLoading(false);
        }
    };

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

                <div className="bg-[#050505] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-serif text-[#F7E7CE] tracking-wider mb-2">Gatekeeper</h2>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Exclusive Access Only</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!sent ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleLogin}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#F7E7CE] transition-colors"
                                            required
                                        />
                                        <Mail className="absolute right-3 top-3.5 text-zinc-600" size={16} />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#F7E7CE] text-black hover:bg-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-colors flex items-center justify-center gap-2 group"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : 'Request Access'}
                                    {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                                </button>

                                <div className="pt-4 border-t border-zinc-900 text-center">
                                    <p className="text-[10px] text-zinc-600">
                                        By continuing, you agree to our Terms & Privacy Policy.
                                    </p>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="sent"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 py-4"
                            >
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-green-500/20">
                                    <Check className="text-green-500" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-white text-lg font-medium mb-2">Check your inbox</h3>
                                    <p className="text-zinc-400 text-sm">
                                        We've sent a magic link to <span className="text-[#F7E7CE]">{email}</span>.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSent(false)}
                                    className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    Use different email
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}