'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Terminal, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function DevLogin() {
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Only show in development
        if (process.env.NODE_ENV === 'development') {
            setIsVisible(true);
        }
    }, []);

    const handleDevLogin = async () => {
        setLoading(true);
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const email = 'test@sugr.com';
        const password = 'password123';

        try {
            // Try to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                // If sign in fails, try to sign up
                console.log('Dev login failed, attempting cleanup/signup...', signInError.message);

                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: 'Test Profile',
                        }
                    }
                });

                if (signUpError) throw signUpError;

                toast.success('Test account created & logged in!');
            } else {
                toast.success('Logged in as Test User');
            }

            // Refresh and go to dashboard
            router.refresh();
            router.push('/dashboard');

        } catch (err: any) {
            console.error('Dev login error:', err);
            toast.error('Dev Login Failed', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={handleDevLogin}
            disabled={loading}
            className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-500 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2"
        >
            <Terminal size={12} />
            {loading ? 'Accessing...' : 'Dev::Bypass'}
        </button>
    );
}
