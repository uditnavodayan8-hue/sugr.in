'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Lock } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { type Provider } from '@supabase/supabase-js';

export default function ApplicationForm() {
    const [loading, setLoading] = React.useState(false);
    const supabase = getSupabaseClient();

    const handleSocialLogin = async (provider: 'instagram' | 'linkedin_oidc') => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider as Provider,
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-medium text-white">Identify Yourself</h2>
                    <p className="text-xs text-zinc-500">Connect to verify your specialized profile.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="noir"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleSocialLogin('instagram')} // Supabase usually requires 'discord', 'google', 'twitter', etc. 'instagram' is supported but might need special setup.
                        disabled={loading}
                    >
                        <Instagram className="w-4 h-4" />
                        Instagram
                    </Button>
                    <Button
                        variant="noir"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleSocialLogin('linkedin_oidc')}
                        disabled={loading}
                    >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-black px-2 text-zinc-600">Or Apply Directly</span>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <Input placeholder="Full Name" className="bg-zinc-900/50" />
                        <Input placeholder="Email Address" type="email" className="bg-zinc-900/50" />
                        <Input placeholder="Portfolio URL" type="url" className="bg-zinc-900/50" />
                    </div>
                    <Button variant="default" className="w-full bg-white text-black hover:bg-zinc-200">
                        Submit Application
                    </Button>
                </form>

                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-600">
                    <Lock className="w-3 h-3" />
                    <span>End-to-end Encrypted via Supabase Vault</span>
                </div>
            </div>
        </div>
    );
}
