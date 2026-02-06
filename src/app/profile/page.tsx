'use client';
import { useState, useEffect, useRef } from 'react';
import { Settings, MapPin, LogOut, Loader2, Shield, Edit3, ChevronRight, Plus, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import { getProfileFeed, createPost, uploadPostImage, Post } from '@/lib/services/feed';
import { toast } from 'sonner';

export default function ProfilePage() {
    const router = useRouter();
    const { profile, loading, error } = useProfile();
    const { signOut, user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load user's posts
    useEffect(() => {
        if (!user) return;
        getProfileFeed(user.id).then(setPosts).catch(console.error);
    }, [user]);

    if (loading) {
        return (
            <main className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#F7E7CE]" />
            </main>
        );
    }

    if (error || !profile) {
        return (
            <main className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center p-6">
                <p className="text-[15px] text-white/40 mb-6">Profile not found</p>
                <button
                    onClick={() => router.push('/onboarding')}
                    className="px-6 py-3 bg-[#F7E7CE] text-[#0A0A0A] rounded-full font-semibold text-[15px]"
                >
                    Complete Profile
                </button>
            </main>
        );
    }

    return (
        <main className="fixed inset-0 bg-[#0A0A0A] text-white overflow-y-auto pb-32">
            {/* Header */}
            <header className="px-8 pt-14 pb-6 flex items-center justify-between">
                <h1 className="text-[34px] font-bold tracking-tight">Profile</h1>
                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Settings size={20} strokeWidth={1.5} />
                </button>
            </header>

            <div className="px-4 space-y-6">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 relative overflow-hidden"
                >
                    {/* Verification Badge */}
                    {profile.verification_level?.id && (
                        <div className="absolute top-6 right-6">
                            <div className="w-10 h-10 rounded-full bg-[#F7E7CE]/10 border border-[#F7E7CE]/20 flex items-center justify-center">
                                <Shield size={18} className="text-[#F7E7CE]" strokeWidth={1.5} />
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-5">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={profile.avatar_url || 'https://via.placeholder.com/80'}
                                className="w-20 h-20 rounded-full object-cover border-2 border-white/10"
                                alt={profile.name}
                            />
                            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F7E7CE] flex items-center justify-center shadow-lg">
                                <Edit3 size={14} className="text-[#0A0A0A]" strokeWidth={2} />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 pt-1">
                            <h2 className="text-[24px] font-semibold tracking-tight mb-1">
                                {profile.name || 'Anonymous'}
                            </h2>
                            <div className="flex items-center gap-2 text-[15px] text-white/40 mb-3">
                                <MapPin size={14} strokeWidth={1.5} />
                                <span>{profile.city || 'Not set'}</span>
                                <span>·</span>
                                <span>{profile.age || '—'}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7E7CE]/10 border border-[#F7E7CE]/20">
                                <span className="text-[13px] font-medium text-[#F7E7CE]">{profile.role}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <div className="mt-6 pt-6 border-t border-white/[0.06]">
                            <p className="text-[15px] text-white/60 leading-relaxed">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {/* Trust Score */}
                    <div className="mt-6 pt-6 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[13px] text-white/40">Trust Score</span>
                            <span className="text-[17px] font-semibold text-[#F7E7CE]">{profile.trust_score || 0}%</span>
                        </div>
                        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${profile.trust_score || 0}%` }}
                                transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                                className="h-full bg-gradient-to-r from-[#F7E7CE] to-[#F7E7CE]/60 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Verification Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6"
                >
                    <h3 className="text-[17px] font-semibold mb-4">Verification</h3>
                    <div className="space-y-3">
                        {[
                            { key: 'phone', label: 'Phone Number', verified: profile.verification_level?.phone },
                            { key: 'id', label: 'Government ID', verified: profile.verification_level?.id },
                            { key: 'social', label: 'Social Media', verified: profile.verification_level?.social },
                            { key: 'wealth', label: 'Financial Status', verified: profile.verification_level?.wealth },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between py-2">
                                <span className="text-[15px] text-white/60">{item.label}</span>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.verified ? 'bg-[#F7E7CE]/20' : 'bg-white/5'
                                    }`}>
                                    {item.verified && (
                                        <div className="w-2 h-2 rounded-full bg-[#F7E7CE]" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Settings Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                >
                    {[
                        { label: 'Edit Profile', onClick: () => router.push('/onboarding') },
                        { label: 'Privacy & Safety', onClick: () => { } },
                        { label: 'Notifications', onClick: () => { } },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.06] active:scale-[0.98] transition-all"
                        >
                            <span className="text-[15px]">{item.label}</span>
                            <ChevronRight size={18} className="text-white/30" strokeWidth={1.5} />
                        </button>
                    ))}
                </motion.div>

                {/* My Posts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[17px] font-semibold">My Posts</h3>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file || !user) return;
                                setUploading(true);
                                try {
                                    const mediaUrl = await uploadPostImage(file, user.id);
                                    const newPost = await createPost({
                                        user_id: user.id,
                                        type: 'photo',
                                        media_url: mediaUrl,
                                    });
                                    setPosts(prev => [newPost, ...prev]);
                                    toast.success('Post uploaded!');
                                } catch (err) {
                                    console.error('Upload error:', err);
                                    toast.error('Failed to upload');
                                } finally {
                                    setUploading(false);
                                }
                            }}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-9 h-9 rounded-full bg-[#F7E7CE] flex items-center justify-center text-[#0A0A0A] hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                        >
                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} strokeWidth={2} />}
                        </button>
                    </div>

                    {/* Posts Grid */}
                    {posts.length === 0 ? (
                        <div className="py-8 text-center">
                            <ImageIcon size={32} className="mx-auto text-white/20 mb-3" />
                            <p className="text-[14px] text-white/40">No posts yet</p>
                            <p className="text-[12px] text-white/20 mt-1">Tap + to add your first photo</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
                            {posts.map((post) => (
                                <div key={post.id} className="aspect-square">
                                    {post.media_url ? (
                                        <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <span className="text-2xl">{post.content?.charAt(0) || '✨'}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Sign Out */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={signOut}
                    className="w-full py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[15px] text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <LogOut size={18} strokeWidth={1.5} />
                    Sign Out
                </motion.button>
            </div>
        </main>
    );
}
