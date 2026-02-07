'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, MoreVertical, Phone, Video, ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EphemeralMessage from '@/components/chat/EphemeralMessage';
import PrivacyShimmer from '@/components/ui/PrivacyShimmer';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getProfile, Profile } from '@/lib/services/profiles';

// MOCK DATA FOR DEMO
const MOCK_MESSAGES = [
    { id: '1', content: "I've been waiting for someone like you.", sender: 'them', type: 'text', timestamp: '10:02 AM' },
    { id: '2', content: "The waiting is the hardest part.", sender: 'me', type: 'text', timestamp: '10:05 AM' },
    { id: '3', content: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", sender: 'them', type: 'image', timestamp: '10:10 AM' },
];

function ChatContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const matchId = searchParams.get('match');
    const { user } = useAuth();
    const supabase = getSupabaseClient();

    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Match Profile
    useEffect(() => {
        if (matchId) {
            getProfile(matchId).then(setMatchProfile);
        }
        // In real app, fetch real messages here
        setMessages(MOCK_MESSAGES.map(m => ({
            ...m,
            isMe: m.sender === 'me',
            isViewed: false
        })));
    }, [matchId]);

    const sendMessage = () => {
        if (!inputValue.trim()) return;
        const newMsg = {
            id: Date.now().toString(),
            content: inputValue,
            sender: 'me',
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            isViewed: false
        };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    return (
        <main className="fixed inset-0 bg-[#0A0A0A] flex flex-col">
            <PrivacyShimmer />

            {/* Header */}
            <header className="px-4 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center text-white/50">
                        <ChevronLeft size={24} />
                    </button>
                    {matchProfile ? (
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={matchProfile.avatar_url || ''} className="w-10 h-10 rounded-full object-cover" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                            </div>
                            <div>
                                <h1 className="font-bold text-sm text-white">{matchProfile.name}</h1>
                                <p className="text-[10px] text-[#DC143C] font-mono tracking-widest uppercase">
                                    Zero-Trace Active
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-10 w-32 bg-white/5 rounded animate-pulse" />
                    )}
                </div>
                <div className="flex items-center gap-4 text-white/50">
                    <Phone size={20} />
                    <Video size={20} />
                    <MoreVertical size={20} />
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="flex justify-center py-4">
                    <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-white/30 uppercase tracking-widest">
                        Messages vanish after viewing
                    </div>
                </div>

                {messages.map((msg) => (
                    <EphemeralMessage
                        key={msg.id}
                        id={msg.id}
                        content={msg.content}
                        type={msg.type as any}
                        imageUrl={msg.type === 'image' ? msg.content : undefined}
                        isMe={msg.isMe}
                        isViewed={msg.isViewed}
                        expiresAfterSeconds={10}
                        onView={(id) => {
                            setMessages(prev => prev.map(m =>
                                m.id === id ? { ...m, isViewed: true } : m
                            ));
                        }}
                    />
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/80 backdrop-blur-md border-t border-white/5 pb-8">
                <div className="flex items-center gap-3 bg-white/5 rounded-full px-2 py-2 border border-white/10 focus-within:border-[#F7E7CE]/50 transition-colors">
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white">
                        <ImageIcon size={20} />
                    </button>
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a disappearing message..."
                        className="flex-1 bg-transparent text-white placeholder:text-white/20 text-sm focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputValue.trim()}
                        className="w-10 h-10 rounded-full bg-[#F7E7CE] flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                    >
                        <Send size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </main>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center"><div className="w-32 h-32 bg-white/5 animate-pulse rounded-full" /></div>}>
            <ChatContent />
        </Suspense>
    );
}
