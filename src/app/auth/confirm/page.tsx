'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

function ConfirmContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your access...');
    const supabase = getSupabaseClient();

    useEffect(() => {
        const confirmAuth = async () => {
            // Get the hash fragment (Supabase returns tokens in hash for PKCE)
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const errorDescription = hashParams.get('error_description');

            if (errorDescription) {
                setStatus('error');
                setMessage(errorDescription);
                return;
            }

            if (accessToken && refreshToken) {
                // Set the session from tokens
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

                if (error) {
                    setStatus('error');
                    setMessage(error.message);
                    return;
                }

                // Check if user has completed onboarding
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('name, avatar_url')
                        .eq('id', user.id)
                        .single();

                    setStatus('success');
                    setMessage('Access Granted!');

                    // Redirect after a brief success animation
                    setTimeout(() => {
                        if (profile?.name && profile?.avatar_url) {
                            router.push('/dashboard');
                        } else {
                            router.push('/onboarding');
                        }
                    }, 1000);
                    return;
                }
            }

            // No tokens in hash - might be a server-side callback
            // Check if we're already authenticated
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setStatus('success');
                setMessage('Already authenticated!');
                setTimeout(() => router.push('/dashboard'), 500);
                return;
            }

            // Still no session - show error
            setStatus('error');
            setMessage('Session expired. Please request a new login link.');
        };

        confirmAuth();
    }, [router, supabase]);

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-zinc-800 p-12 rounded-2xl text-center max-w-sm w-full"
            >
                {status === 'loading' && (
                    <div className="space-y-6">
                        <Loader2 size={48} className="text-[#F7E7CE] animate-spin mx-auto" />
                        <p className="text-white/60 text-sm">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="space-y-6"
                    >
                        <CheckCircle size={48} className="text-green-500 mx-auto" />
                        <p className="text-white text-lg font-serif">{message}</p>
                    </motion.div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <XCircle size={48} className="text-red-500 mx-auto" />
                        <p className="text-white/60 text-sm">{message}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full py-3 bg-[#F7E7CE] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </motion.div>
        </main>
    );
}

export default function ConfirmPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
            <ConfirmContent />
        </Suspense>
    );
}
