'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, Star, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileDossierProps {
    userId: string;
    className?: string;
}

interface ProfileData {
    id: string;
    full_name: string;
    avatar_url: string;
    role: 'provider' | 'protege';
    bio: string;
    lifestyle_tier: string;
    sugr_index: number;
    location?: string;
    occupation?: string;
}

export default function ProfileDossier({ userId, className }: ProfileDossierProps) {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (err: any) {
                console.error('Error fetching dossier:', err);
                setError('Failed to load dossier.');
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            fetchProfile();
        }
    }, [userId, supabase]);

    if (loading) {
        return (
            <div className={cn("p-6 rounded-2xl bg-zinc-900/50 border border-white/5 animate-pulse h-64", className)}>
                <div className="flex gap-4 items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-white/5" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/5 rounded" />
                        <div className="h-3 w-20 bg-white/5 rounded" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-5/6 bg-white/5 rounded" />
                    <div className="h-3 w-4/6 bg-white/5 rounded" />
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className={cn("p-6 rounded-2xl bg-red-900/10 border border-red-500/20 text-red-400", className)}>
                {error || 'Profile not found'}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "relative overflow-hidden rounded-3xl bg-[#111] border border-white/10 p-6 shadow-2xl",
                className
            )}
        >
            {/* Background Gradient */}

            {/* Bio */}
            {profile.bio && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-white/80 leading-relaxed italic">
                        "{profile.bio}"
                    </p>
                </div>
            )}
        </motion.div>
    );
}
