'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, MapPin, Shield, MoreHorizontal, UserPlus, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getProfile, Profile } from '@/lib/services/profiles';
import { getMatches, Match, createSwipe } from '@/lib/services/matches';
import { getProfileFeed, Post } from '@/lib/services/feed';
import ProfileFeed from '@/components/profile/ProfileFeed';
import FloatingChatBubble from '@/components/chat/FloatingChatBubble';
import { toast } from 'sonner';
import { createNotification } from '@/lib/services/notifications';

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [matchInfo, setMatchInfo] = useState<{ isMatched: boolean; matchId: string | null; isPending: boolean }>({ isMatched: false, matchId: null, isPending: false });
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        if (!userId || !user) return;

        const loadData = async () => {
            try {
                // Load profile
                const profileData = await getProfile(userId);
                setProfile(profileData);

                // Check if matched
                const matches = await getMatches(user.id);
                const match = matches.find(m =>
                    (m.user_a === userId || m.user_b === userId) &&
                    m.status === 'accepted'
                );

                setMatchInfo({
                    isMatched: !!match,
                    matchId: match?.id || null,
                    isPending: false
                });

                // Load feed posts
                const feed = await getProfileFeed(userId);
                setPosts(feed);
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId, user]);

    const handleRequestAccess = async () => {
        if (!user || requesting) return;
        setRequesting(true);

        try {
            const { isMatch } = await createSwipe(user.id, userId, 'like');

            if (isMatch) {
                toast.success("It's a Match!", {
                    description: `You matched with ${profile?.name}`,
                });
                // Reload match info
                const matches = await getMatches(user.id);
                const match = matches.find(m =>
                    (m.user_a === userId || m.user_b === userId) &&
                    m.status === 'accepted'
                );
                setMatchInfo({
                    isMatched: true,
                    matchId: match?.id || null,
                    isPending: false
                });
            } else {
                toast.success('Request Sent', {
                    description: 'They will be notified of your interest',
                });
                setMatchInfo(prev => ({ ...prev, isPending: true }));

                // Notify them of the request
                await createNotification({
                    user_id: userId,
                    type: 'like',
                    title: 'New Profile Visitor',
                    body: `${user.user_metadata?.full_name || 'Someone'} wants to connect with you!`,
                    data: { actorId: user.id }
                });
            }
        } catch (err) {
            console.error('Error requesting access:', err);
            toast.error('Something went wrong');
        } finally {
            setRequesting(false);
        }
    };

    if (loading) {
        return (
            <main className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#F7E7CE]" />
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center p-6">
                <p className="text-[15px] text-white/40 mb-6">Profile not found</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-white/5 rounded-full text-[15px]"
                >
                    Go Back
                </button>
            </main>
        );
    }

    return (
        <main className="fixed inset-0 bg-[#0A0A0A] text-white overflow-y-auto pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 px-4 pt-12 pb-4 bg-[#0A0A0A]/80 backdrop-blur-xl flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                >
                    <ArrowLeft size={20} strokeWidth={1.5} />
                </button>

                <h1 className="text-[17px] font-semibold">{profile.name}</h1>

                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <MoreHorizontal size={20} strokeWidth={1.5} />
                </button>
            </header>

            {/* Profile Header */}
            <div className="px-6 pb-6">
                <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={profile.avatar_url || 'https://via.placeholder.com/96'}
                            className={cn(
                                "w-24 h-24 rounded-full object-cover border-2",
                                matchInfo.isMatched ? "border-[#F7E7CE]" : "border-white/10"
                            )}
                            alt={profile.name}
                        />
                        {profile.verification_level?.id && (
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#F7E7CE] flex items-center justify-center shadow-lg">
                                <Shield size={16} className="text-[#0A0A0A]" strokeWidth={2} />
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex-1 pt-2">
                        <div className="flex items-center gap-6 mb-4">
                            <div className="text-center">
                                <p className="text-[20px] font-bold">24</p>
                                <p className="text-[12px] text-white/40">Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[20px] font-bold">1.2K</p>
                                <p className="text-[12px] text-white/40">Admirers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[20px] font-bold">{profile.trust_score || 0}%</p>
                                <p className="text-[12px] text-white/40">Trust</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        {matchInfo.isMatched ? (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 py-2.5 bg-white/5 rounded-xl text-[14px] flex items-center justify-center gap-2 text-white/60">
                                    <UserCheck size={16} strokeWidth={2} />
                                    Connected
                                </div>
                            </div>
                        ) : matchInfo.isPending ? (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 py-2.5 bg-[#F7E7CE]/10 border border-[#F7E7CE]/20 rounded-xl text-[14px] flex items-center justify-center gap-2 text-[#F7E7CE]">
                                    <Loader2 size={16} className="animate-spin" />
                                    Request Sent
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleRequestAccess}
                                disabled={requesting}
                                className="w-full py-2.5 bg-[#F7E7CE] text-[#0A0A0A] rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                            >
                                {requesting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <UserPlus size={16} strokeWidth={2} />
                                )}
                                {requesting ? 'Sending...' : 'Request'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Name & Bio */}
                <div className="mt-5">
                    <h2 className="text-[18px] font-semibold mb-1">{profile.name}</h2>
                    <div className="flex items-center gap-2 text-[14px] text-white/40 mb-3">
                        <span className="px-2 py-0.5 bg-[#F7E7CE]/10 rounded-full text-[#F7E7CE] text-[12px]">{profile.role}</span>
                        {profile.city && (
                            <>
                                <span>·</span>
                                <MapPin size={12} />
                                <span>{profile.city}</span>
                            </>
                        )}
                    </div>
                    {profile.bio && matchInfo.isMatched && (
                        <p className="text-[14px] text-white/60 leading-relaxed">{profile.bio}</p>
                    )}
                    {profile.bio && !matchInfo.isMatched && (
                        <p className="text-[14px] text-white/30 italic">Bio hidden until connected</p>
                    )}
                </div>
            </div>

            {/* Feed Tabs */}
            <div className="flex border-b border-white/[0.06] mb-1">
                {['Posts', 'Vibes', 'Interests'].map((tab, i) => (
                    <button
                        key={tab}
                        className={cn(
                            "flex-1 py-3 text-[13px] font-semibold transition-colors",
                            i === 0 ? "text-white border-b-2 border-[#F7E7CE]" : "text-white/40"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Profile Feed */}
            <ProfileFeed
                posts={posts}
                isUnlocked={matchInfo.isMatched}
                onRequestAccess={handleRequestAccess}
            />

            {/* Floating Chat Bubble (only if matched) */}
            <AnimatePresence>
                {matchInfo.isMatched && matchInfo.matchId && (
                    <FloatingChatBubble
                        matchId={matchInfo.matchId}
                        partnerName={profile.name || 'User'}
                        partnerAvatar={profile.avatar_url}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
