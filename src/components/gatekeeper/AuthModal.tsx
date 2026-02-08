'use client';
import { useState } from 'react';
import { X, ArrowRight, AlertCircle, Mail, CheckCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabaseClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
// @ts-ignore
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { useRouter } from 'next/navigation';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthMode = 'signin' | 'signup';
type Method = 'options' | 'email-password' | 'magic-link' | 'phone' | 'otp';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const router = useRouter();
    const [authMode, setAuthMode] = useState<AuthMode>('signin');
    const [method, setMethod] = useState<Method>('options');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = getSupabaseClient();

    const resetFlow = () => {
        setMethod('options');
        setError(null);
        setSent(false);
        setOtp('');
        setPassword('');
    };

    // Google OAuth
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
        } catch (err: any) {
            console.error('Google Auth Error:', err);
            setError(err.message);
            setGoogleLoading(false);
        }
    };

    // Email/Password Sign Up
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (error) throw error;

            if (data.session) {
                toast.success('Account created!', { description: 'Welcome to Sugr.' });
                onClose();
                window.location.href = '/onboarding';
            } else if (data.user && !data.session) {
                setSent(true);
                toast.success('Confirmation sent', { description: 'Check email to verify account.' });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Email/Password Sign In
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            toast.success('Signed In');
            onClose();
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message || 'Invalid login credentials');
        } finally {
            setLoading(false);
        }
    };

    // Magic Link
    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim().toLowerCase(),
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) throw error;
            setSent(true);
            toast.success('Magic Link Sent!');
        } catch (err: any) {
            setError(err.message);
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
                className="bg-zinc-900 border border-zinc-800 p-0 rounded-2xl w-full max-w-sm relative overflow-hidden flex flex-col"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white z-10">
                    <X size={20} />
                </button>

                {/* Header / Tabs */}
                <div className="flex border-b border-zinc-800">
                    <button
                        onClick={() => { setAuthMode('signin'); resetFlow(); }}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${authMode === 'signin' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setAuthMode('signup'); resetFlow(); }}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${authMode === 'signup' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Create Account
                    </button>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-serif text-[#F7E7CE] mb-6 tracking-wide text-center">
                        {authMode === 'signin' ? 'Welcome Back' : 'Join the Elite'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-300">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* MAIN OPTIONS VIEW */}
                    {method === 'options' && (
                        <div className="space-y-3">
                            <button
                                onClick={() => setMethod('email-password')}
                                className="w-full py-3 bg-[#F7E7CE] text-black rounded-xl font-bold text-sm hover:bg-white transition-colors flex items-center justify-center gap-2"
                            >
                                <Mail size={18} />
                                {authMode === 'signin' ? 'Sign in with Email' : 'Sign up with Email'}
                            </button>

                            <button
                                onClick={handleGoogleSignIn}
                                disabled={googleLoading}
                                className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
                            >
                                {googleLoading ? (
                                    <span className="animate-pulse">Connecting...</span>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                        Google
                                    </>
                                )}
                            </button>

                            {authMode === 'signin' && (
                                <button
                                    onClick={() => setMethod('magic-link')}
                                    className="w-full py-3 bg-zinc-800 text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-700 transition-colors"
                                >
                                    Send Magic Link
                                </button>
                            )}
                        </div>
                    )}

                    {/* EMAIL/PASSWORD FORM */}
                    {method === 'email-password' && !sent && (
                        <form onSubmit={authMode === 'signup' ? handleSignUp : handleSignIn} className="space-y-4">
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
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#F7E7CE] outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[#F7E7CE] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <span className="animate-pulse">Processing...</span> : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
                            </button>
                            <button type="button" onClick={resetFlow} className="w-full text-zinc-500 text-xs hover:text-white">Back</button>
                        </form>
                    )}

                    {/* MAGIC LINK FORM */}
                    {method === 'magic-link' && !sent && (
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
                                disabled={loading}
                                className="w-full py-3 bg-[#F7E7CE] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <span className="animate-pulse">Sending...</span> : 'Send Magic Link'}
                            </button>
                            <button type="button" onClick={resetFlow} className="w-full text-zinc-500 text-xs hover:text-white">Back</button>
                        </form>
                    )}

                    {/* SUCCESS STATE (Magic Link / Verify Email) */}
                    {sent && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Check Your Email</h3>
                                <p className="text-zinc-400 text-sm mt-2">
                                    {authMode === 'signup' ? 'Verification link sent to ' : 'Magic link sent to '}
                                    <span className="text-white">{email}</span>
                                </p>
                            </div>
                            <button type="button" onClick={resetFlow} className="text-zinc-500 text-xs hover:text-white">Use a different email</button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
