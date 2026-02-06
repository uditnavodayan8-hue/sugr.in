'use client';
import { motion } from 'framer-motion';
import { Lock, Heart, Sparkles, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FeedPost {
    id: string;
    type: 'photo' | 'vibe' | 'interest';
    mediaUrl?: string;
    content?: string;
    emoji?: string;
}

interface ProfileFeedProps {
    posts: FeedPost[];
    isUnlocked: boolean;
    onRequestAccess?: () => void;
}

export default function ProfileFeed({ posts, isUnlocked, onRequestAccess }: ProfileFeedProps) {
    const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);

    // Sample placeholder data if no posts
    const displayPosts = posts.length > 0 ? posts : [
        { id: '1', type: 'photo' as const, mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
        { id: '2', type: 'vibe' as const, content: 'Living my best life ✨', emoji: '✨' },
        { id: '3', type: 'photo' as const, mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
        { id: '4', type: 'interest' as const, content: 'Fine Dining', emoji: '🍷' },
        { id: '5', type: 'photo' as const, mediaUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400' },
        { id: '6', type: 'vibe' as const, content: 'Adventure seeker 🌍', emoji: '🌍' },
    ];

    return (
        <div className="relative">
            {/* Grid */}
            <div className="grid grid-cols-3 gap-1">
                {displayPosts.map((post, i) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => isUnlocked && setSelectedPost(post)}
                        className={cn(
                            "aspect-square relative overflow-hidden",
                            isUnlocked && "cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                        )}
                    >
                        {post.type === 'photo' && post.mediaUrl ? (
                            <img
                                src={post.mediaUrl}
                                alt=""
                                className={cn(
                                    "w-full h-full object-cover",
                                    !isUnlocked && "blur-xl scale-110"
                                )}
                            />
                        ) : (
                            <div className={cn(
                                "w-full h-full flex flex-col items-center justify-center",
                                post.type === 'vibe'
                                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                                    : "bg-gradient-to-br from-[#F7E7CE]/20 to-orange-500/20",
                                !isUnlocked && "blur-lg"
                            )}>
                                <span className="text-3xl mb-2">{post.emoji}</span>
                                <span className={cn(
                                    "text-[11px] text-white/60 px-2 text-center",
                                    !isUnlocked && "opacity-0"
                                )}>
                                    {post.content}
                                </span>
                            </div>
                        )}

                        {/* Type Badge */}
                        {isUnlocked && (
                            <div className="absolute top-2 left-2">
                                {post.type === 'vibe' && <Sparkles size={14} className="text-purple-400" />}
                                {post.type === 'interest' && <Heart size={14} className="text-pink-400" />}
                                {post.type === 'photo' && <ImageIcon size={14} className="text-white/60" />}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Blur Overlay for Locked */}
            {!isUnlocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[#0A0A0A]/60 backdrop-blur-md flex flex-col items-center justify-center"
                >
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <Lock size={32} className="text-[#F7E7CE]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[20px] font-semibold mb-2">Private Feed</h3>
                    <p className="text-[14px] text-white/40 mb-6 text-center px-8">
                        Send a request to unlock their photos and vibes
                    </p>
                    <button
                        onClick={onRequestAccess}
                        className="px-8 py-3.5 bg-[#F7E7CE] text-[#0A0A0A] rounded-full font-semibold text-[15px] active:scale-95 transition-transform shadow-lg"
                    >
                        Request Access
                    </button>
                </motion.div>
            )}

            {/* Fullscreen View */}
            {selectedPost && isUnlocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedPost(null)}
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                >
                    {selectedPost.type === 'photo' && selectedPost.mediaUrl ? (
                        <img
                            src={selectedPost.mediaUrl}
                            alt=""
                            className="max-w-full max-h-full rounded-2xl"
                        />
                    ) : (
                        <div className="text-center">
                            <span className="text-6xl mb-4 block">{selectedPost.emoji}</span>
                            <p className="text-[20px] text-white/80">{selectedPost.content}</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
