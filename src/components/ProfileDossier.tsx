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
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name} className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10">
                                    <User className="w-8 h-8 text-white/30" />
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-white/10">
                                {profile.role === 'provider' ? (
                                    <Shield className="w-3 h-3 text-yellow-400" fill="currentColor" />
                                ) : (
                                    <Star className="w-3 h-3 text-purple-400" fill="currentColor" />
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-white">{profile.full_name || 'Anonymous'}</h2>
                            <p className="text-sm text-white/50 capitalize">{profile.role}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Sugr Index</p>
                        <div className="text-2xl font-mono text-emerald-400">{profile.sugr_index ?? 1}</div>
                    </div>
                </div>

                {/* Stats / Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {profile.lifestyle_tier && (
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/70">
                            {profile.lifestyle_tier}
                        </span>
                    )}
                    {profile.location && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/70">
                            <MapPin size={12} /> {profile.location}
                        </span>
                    )}
                    {profile.occupation && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/70">
                            <Briefcase size={12} /> {profile.occupation}
                        </span>
                    )}
                </div>

                {/* Bio */}
                {profile.bio && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-white/80 leading-relaxed italic">
                            "{profile.bio}"
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
