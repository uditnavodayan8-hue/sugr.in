'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, MoreVertical, Phone, Video, ChevronLeft, Check, CheckCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EphemeralMessage from '@/components/chat/EphemeralMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';
import OnlineStatus from '@/components/ui/OnlineStatus';
import PrivacyShimmer from '@/components/ui/PrivacyShimmer';
import { useAuth } from '@/context/AuthContext';
import { getProfile, Profile } from '@/lib/services/profiles';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { usePresence } from '@/hooks/usePresence';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';

function ChatContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const matchId = searchParams.get('match');
    const partnerId = searchParams.get('partner'); // Pass partner ID in URL
    const { user } = useAuth();

    const [inputValue, setInputValue] = useState('');
    const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Real-time hooks
    const { messages, loading, sendMessage, markAsRead } = useRealtimeMessages(matchId);
    const { partnerPresence } = usePresence(partnerId);
    const { isPartnerTyping, setTyping } = useTypingIndicator(matchId, partnerId);

    // Fetch Match Profile
    useEffect(() => {
        if (partnerId) {
            getProfile(partnerId).then(setMatchProfile);
        }
    }, [partnerId]);

    // Auto-scroll on new messages
    useEffect(() => {
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, [messages]);

    // Mark messages as read when viewing
    useEffect(() => {
        if (matchId && messages.length > 0) {
            markAsRead();
        }
    }, [matchId, messages, markAsRead]);

    // Handle input change with typing indicator
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setTyping(true);
    };

    // Send message
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        setTyping(false);
        const success = await sendMessage(inputValue.trim());
        if (success) {
            setInputValue('');
        }
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
                                <div className="absolute bottom-0 right-0">
                                    <OnlineStatus
                                        status={partnerPresence?.status || 'offline'}
                                        size="sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <h1 className="font-bold text-sm text-white">{matchProfile.name}</h1>
                                <OnlineStatus
                                    status={partnerPresence?.status || 'offline'}
                                    lastSeen={partnerPresence?.lastSeen}
                                    showText
                                    size="sm"
                                />
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-center py-4">
                    <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-white/30 uppercase tracking-widest">
                        Messages are end-to-end encrypted
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Send size={24} className="text-white/30" />
                        </div>
                        <p className="text-white/40 text-sm">No messages yet</p>
                        <p className="text-white/20 text-xs mt-1">Say hello to start the conversation</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id;
                        const isRead = msg.read_at !== null;

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${isMe
                                            ? 'bg-[#F7E7CE] text-black rounded-br-sm'
                                            : 'bg-white/10 text-white rounded-bl-sm'
                                        }`}
                                >
                                    {msg.media_url ? (
                                        <img
                                            src={msg.media_url}
                                            alt="Media"
                                            className="max-w-full rounded-lg"
                                        />
                                    ) : (
                                        <p className="text-sm">{msg.content}</p>
                                    )}

                                    {/* Timestamp and Read Receipt */}
                                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <span className={`text-[10px] ${isMe ? 'text-black/50' : 'text-white/30'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        {isMe && (
                                            isRead ? (
                                                <CheckCheck size={12} className="text-black/60" />
                                            ) : (
                                                <Check size={12} className="text-black/40" />
                                            )
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}

                {/* Typing Indicator */}
                <AnimatePresence>
                    {isPartnerTyping && (
                        <TypingIndicator name={matchProfile?.name} />
                    )}
                </AnimatePresence>

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
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-white placeholder:text-white/20 text-sm focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        onBlur={() => setTyping(false)}
                    />
                    <button
                        onClick={handleSendMessage}
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
