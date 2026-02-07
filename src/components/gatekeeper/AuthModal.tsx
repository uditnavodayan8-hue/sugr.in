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
    const [googleLoading, setGoogleLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = getSupabaseClient();

    // Google OAuth Sign-In
    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (error) throw error;
            // Redirect happens automatically
        } catch (err: any) {
            console.error('Google Auth Error:', err);
            const msg = err.message || 'Google sign-in failed. Please try again.';
            setError(msg);
            toast.error('Google Sign-In Failed', { description: msg });
            setGoogleLoading(false);
        }
    };

    // Magic Link Sign-In
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
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
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
                                📧 Click the <strong>magic link</strong> in the email to sign in.
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
                    <div className="space-y-4">
                        {/* Google Sign-In Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading}
                            className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {googleLoading ? (
                                <span className="animate-pulse">Connecting...</span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-zinc-900 px-2 text-zinc-600">or</span>
                            </div>
                        </div>

                        {/* Email Form */}
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
                        </form>

                        <p className="text-center text-zinc-500 text-[10px] mt-4">
                            No password needed. Sign in instantly with Google or email.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
