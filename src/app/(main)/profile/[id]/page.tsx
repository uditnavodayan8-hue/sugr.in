"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { getProfileById, type Profile } from '@/lib/services/profile';
import { reportUser, blockUser } from '@/lib/services/safety';
import { toast } from 'sonner';

export default function ProfileDetailPage() {
    const router = useRouter();
    const params = useParams();
    const profileId = params.id as string;

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [profileId]);

    const loadProfile = async () => {
        try {
            const data = await getProfileById(profileId);
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleReport = async () => {
        const reason = prompt('Please provide a reason for reporting this user:');
        if (!reason) return;

        try {
            await reportUser(profileId, reason);
            toast.success('User reported. Thank you for keeping requests safe.');
            setShowMenu(false);
        } catch (error) {
            toast.error('Failed to report user');
        }
    };

    const handleBlock = async () => {
        if (!confirm('Are you sure you want to block this user? You will not see each other again.')) return;

        try {
            await blockUser(profileId);
            toast.success('User blocked');
            router.push('/discovery'); // Redirect away
        } catch (error) {
            toast.error('Failed to block user');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center text-white">
                <Icon name="error_outline" className="text-4xl mb-4 text-gray-400" />
                <p>Profile not found</p>
                <button onClick={() => router.back()} className="mt-4 text-primary">Go Back</button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto relative min-h-screen bg-background-dark overflow-hidden">
            <nav className="absolute top-0 w-full z-20 flex justify-between items-center p-6 pt-12 bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/40 transition-colors">
                    <Icon name="arrow_back" />
                </button>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/40 transition-colors"
                    >
                        <Icon name="more_horiz" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-12 w-48 bg-surface-dark border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                            <button onClick={handleReport} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-2">
                                <Icon name="flag" className="text-gray-400" /> Report User
                            </button>
                            <button onClick={handleBlock} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                                <Icon name="block" /> Block User
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="relative h-[75vh] w-full">
                <img
                    src={profile.avatar_url || "https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1000&auto=format&fit=crop"}
                    className="w-full h-full object-cover"
                    alt={profile.name}
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background-dark to-transparent z-10 flex flex-col justify-end p-6 pb-12">
                    <div className="self-start mb-4">
                        {profile.lifestyle_tier && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/60 bg-primary/10 backdrop-blur-sm">
                                <Icon name="verified" className="text-primary text-xs" />
                                <span className="text-primary text-xs font-bold uppercase tracking-wider">{profile.lifestyle_tier}</span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-1 font-serif">{profile.name}, {profile.age}</h1>
                    <div className="flex items-center text-gray-300 text-sm font-medium">
                        <Icon name="location_on" className="text-base mr-1" /> {profile.city || 'Unknown'}
                        {profile.distance_km !== undefined && (
                            <>
                                <span className="mx-2">•</span> {Math.round(profile.distance_km)}km away
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative z-10 -mt-8 bg-background-dark rounded-t-[2rem] px-6 pt-8 pb-32 space-y-8 border-t border-white/5">
                <div className="text-center px-4">
                    <p className="text-lg italic text-gray-400 font-light leading-relaxed">"{profile.bio || 'No bio yet.'}"</p>
                </div>

                {profile.is_verified && (
                    <div className="bg-surface-dark border border-white/5 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Icon name="security" /></div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Verified Profile</h3>
                                <p className="text-xs text-gray-400">Identity Confirmed</p>
                            </div>
                        </div>
                        <Icon name="check_circle" className="text-primary" />
                    </div>
                )}

                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 ml-1">Interests</h2>
                    <div className="flex flex-wrap gap-2">
                        {(profile.interests || []).map(t => (
                            <span key={t} className="px-4 py-2 rounded-lg bg-surface-dark border border-white/5 text-sm text-gray-300">{t}</span>
                        ))}
                        {(!profile.interests || profile.interests.length === 0) && (
                            <span className="text-gray-500 text-sm italic">No interests listed</span>
                        )}
                    </div>
                </div>

                <div className="h-12"></div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark border-t border-white/5 flex gap-4 z-50">
                <button className="flex-1 h-14 rounded-xl bg-surface-dark border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all">
                    <Icon name="favorite_border" className="text-gray-400" />
                    <span className="font-medium text-sm">Interest</span>
                </button>
                <button onClick={() => router.push('/gifts')} className="flex-[2] h-14 rounded-xl bg-gradient-to-r from-primary to-[#b59a0b] text-background-dark font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(242,204,13,0.4)] active:scale-95 transition-all">
                    <Icon name="card_giftcard" />
                    <span>Send Gift</span>
                </button>
            </div>
        </div>
    );
}
