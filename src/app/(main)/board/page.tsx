"use client";

import React, { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { getBroadcastFeed, type Broadcast } from '@/lib/services/broadcasts';
import { subscribeToBroadcasts } from '@/lib/services/broadcasts.client';
import { toast } from 'sonner';

// Helper to format relative time
function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

const BoardCard: React.FC<{ broadcast: Broadcast }> = ({ broadcast }) => {
    // Mocking missing fields for now based on 'content' or random defaults
    // In a real app, these would be columns in the DB
    const isBlackCard = broadcast.profile?.lifestyle_tier === 'video_viral'; // Example condition
    const location = "Nearby";
    const isVerified = true;

    return (
        <article className={`bg-surface-dark rounded-xl p-5 border ${isBlackCard ? 'border-primary/30 shadow-[0_0_15px_rgba(242,204,13,0.1)]' : 'border-white/5'} relative`}>
            {isBlackCard && (
                <div className="absolute -top-3 right-5 bg-black text-primary px-3 py-1 rounded-sm border border-primary text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Icon name="workspace_premium" className="text-[10px]" /> Black Card
                </div>
            )}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    <Icon name="verified" className="text-primary text-sm" />
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">Verified {broadcast.profile?.lifestyle_tier || 'Member'}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">{timeAgo(broadcast.created_at)}</span>
            </div>
            <div className="flex items-start gap-4 mb-4">
                <img
                    src={broadcast.profile?.avatar_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop"}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/50"
                    alt={broadcast.profile?.name || 'User'}
                />
                <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{broadcast.profile?.name || 'Anonymous'}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-0.5"><Icon name="location_on" className="text-[10px]" /> {location}</span>
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-5">{broadcast.content}</p>

            {/* Placeholder data for missing columns */}
            <div className="flex items-center justify-between mb-6 p-3 bg-black/30 rounded-lg border border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Allowance</span>
                    <span className="text-lg font-bold text-primary">Negotiable</span>
                </div>
                <div className="h-8 w-px bg-white/10 mx-2"></div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Perks</span>
                    <span className="text-xs font-medium text-white">Fine Dining</span>
                </div>
            </div>

            <div className="flex gap-3">
                <button className="flex-1 bg-primary hover:bg-primary-dim text-black font-bold py-3 px-4 rounded-md text-sm transition-colors">Request to Join</button>
                <button className="aspect-square flex items-center justify-center border border-white/20 rounded-md hover:bg-white/5 text-gray-400"><Icon name="chat_bubble_outline" className="text-base" /></button>
            </div>
        </article>
    );
};

export default function BoardPage() {
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();

        // Subscribe to real-time updates
        const unsubscribe = subscribeToBroadcasts((newBroadcast) => {
            // We need to fetch the profile for the new broadcast, or just add it with placeholder
            // For simplicity, just reloading for now or prepending with partial data
            setBroadcasts(prev => [newBroadcast, ...prev]);
            toast.info('New post on the board!');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const loadData = async () => {
        try {
            const data = await getBroadcastFeed();
            setBroadcasts(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load board');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-background-dark flex flex-col">
            <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5 pt-12 pb-4 px-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gold-text">The Board</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Exclusive Opportunities</p>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-primary object-cover" alt="Profile" />
                        <div className="absolute -bottom-1 -right-1 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black">9+</div>
                    </div>
                </div>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-dark border border-white/10 rounded-full text-xs font-medium text-white whitespace-nowrap"><Icon name="tune" className="text-base text-primary" /> Filters</button>
                    <button className="px-4 py-2 bg-primary text-black rounded-full text-xs font-bold shadow-[0_0_10px_rgba(242,204,13,0.3)] whitespace-nowrap">Near Me</button>
                    <button className="px-4 py-2 bg-surface-dark border border-white/10 rounded-full text-xs font-medium text-gray-400 whitespace-nowrap">Travel</button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 pt-6 pb-24 space-y-6">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : broadcasts.length > 0 ? (
                    broadcasts.map(b => <BoardCard key={b.id} broadcast={b} />)
                ) : (
                    <div className="text-center py-10 text-gray-400">
                        <p>No active broadcasts locally.</p>
                        <p className="text-sm mt-2">Be the first to post!</p>
                    </div>
                )}
            </main>
            <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-[0_0_15px_rgba(242,204,13,0.4)] flex items-center justify-center z-40 hover:scale-105 transition-transform">
                <Icon name="add" className="text-2xl" />
            </button>
        </div>
    )
}
