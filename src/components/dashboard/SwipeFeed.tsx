'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Profile } from '@/lib/services/profiles';
import { sendAccessRequest } from '@/lib/services/access';
import { toast } from 'sonner';
import { KeyRound } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { SwipeCard } from '../discovery/SwipeCard';
import { MatchPopup } from '../discovery/MatchPopup';

interface SwipeFeedProps {
    initialProfiles: Profile[];
    currentUserId: string;
}

export default function SwipeFeed({ initialProfiles, currentUserId }: SwipeFeedProps) {
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles || []);
    const [history, setHistory] = useState<Profile[]>([]); // For undo functionality (optional)

    const { profile: currentUserProfile } = useProfile();
    const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (profiles.length === 0) return;

        const currentProfile = profiles[0];

        // Optimistic UI update
        const newProfiles = profiles.slice(1);
        setProfiles(newProfiles);
        setHistory(prev => [currentProfile, ...prev]);

        if (direction === 'right') {
            // Request Access
            try {
                // Haptic feedback
                if (navigator.vibrate) navigator.vibrate(50);

                const { success, match, error } = await sendAccessRequest(currentUserId, currentProfile.id);
                if (success) {
                    if (match) {
                        // TRIGGER MATCH OVERLAY
                        setMatchedProfile(currentProfile);
                        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]); // Celebration vibe
                    } else {
                        toast.success(`Access requested for ${currentProfile.name}`);
                    }
                } else {
                    console.error('Swipe request failed:', error);
                }
            } catch (err) {
                console.error('Swipe error:', err);
            }
        }
    };

    if (profiles.length === 0) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                    <KeyRound className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-2xl font-serif italic">No more profiles</h2>
                <p className="text-white/40 text-center max-w-xs">
                    You've seen everyone nearby. Check back later.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2 border border-white/20 rounded-full uppercase text-xs tracking-widest hover:bg-white/10 transition"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black overflow-hidden flex flex-col pt-16">
            {/* MATCH POPUP */}
            <AnimatePresence>
                {currentUserProfile && matchedProfile && (
                    <MatchPopup
                        profile={{
                            ...matchedProfile,
                            imageUrl: matchedProfile.avatar_url || '',
                            role: matchedProfile.role as any,
                            location: matchedProfile.city || 'Nearby',
                            allowanceRange: matchedProfile.allowance_range || undefined,
                            lifestyle: matchedProfile.lifestyle_tags || []
                        }}
                        currentUser={{
                            name: currentUserProfile.name || 'You',
                            imageUrl: currentUserProfile.avatar_url || ''
                        }}
                        onClose={() => setMatchedProfile(null)}
                        onMessage={() => {
                            setMatchedProfile(null);
                            toast.success("Message sent! Continue swiping.");
                        }}
                    />
                )}
            </AnimatePresence>

            <div className="relative w-full h-[75vh] max-w-md mx-auto flex items-center justify-center px-4 mt-6">
                <AnimatePresence>
                    {profiles.map((profile, index) => {
                        // Only render the top 2 cards for performance
                        if (index > 1) return null;
                        const isTop = index === 0;

                        return (
                            <SwipeCard
                                key={profile.id}
                                profile={{
                                    ...profile,
                                    imageUrl: profile.avatar_url || '',
                                    location: profile.city || 'Nearby',
                                    allowanceRange: profile.allowance_range || undefined,
                                    lifestyle: profile.lifestyle_tags || [],
                                    role: profile.role as any
                                }}
                                onSwipe={handleSwipe}
                                style={{
                                    zIndex: profiles.length - index,
                                    scale: isTop ? 1 : 0.95,
                                }}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
