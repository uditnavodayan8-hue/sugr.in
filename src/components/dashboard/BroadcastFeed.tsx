'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDiscoveryFeed, Post } from '@/lib/services/feed';
import { Loader2, MessageCircle, Heart, Share2, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface BroadcastFeedProps {
    currentUserId: string;
}

export default function BroadcastFeed({ currentUserId }: BroadcastFeedProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeed() {
            try {
                const data = await getDiscoveryFeed(currentUserId);
                setPosts(data);
            } catch (error: any) {
                if (error.name === 'AbortError') return;
                console.error('Failed to load feed:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeed();
    }, [currentUserId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-white/20" />
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white">No broadcasts yet</h3>
                <p className="text-white/40 max-w-xs">
                    Community posts and announcements will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="pb-24 pt-4 px-4 space-y-6 max-w-2xl mx-auto">
            {posts.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 flex items-center gap-3">
                        <Link href={`/profile/${post.user_id}`}>
                            <img
                                src={post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                                alt={post.profiles?.name || 'User'}
                                className="w-10 h-10 rounded-full object-cover border border-white/10"
                            />
                        </Link>
                        <div>
                            <Link href={`/profile/${post.user_id}`} className="font-bold text-white hover:underline">
                                {post.profiles?.name || 'Unknown User'}
                            </Link>
                            <p className="text-xs text-white/40">
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-2">
                        {post.content && (
                            <p className="text-sm text-white/90 whitespace-pre-wrap mb-3 leading-relaxed">
                                {post.content}
                            </p>
                        )}
                    </div>

                    {/* Media */}
                    {post.media_url && (
                        <div className="relative aspect-video bg-black">
                            <img
                                src={post.media_url}
                                alt="Post content"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-4 flex items-center justify-between border-t border-white/5">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-1 text-white/40 hover:text-red-500 transition-colors">
                                <Heart size={18} />
                                <span className="text-xs">Like</span>
                            </button>
                            <button className="flex items-center gap-1 text-white/40 hover:text-white transition-colors">
                                <MessageCircle size={18} />
                                <span className="text-xs">Reply</span>
                            </button>
                        </div>
                        <button className="text-white/40 hover:text-white transition-colors">
                            <Share2 size={18} />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
