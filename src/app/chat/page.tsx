'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, MoreVertical, Phone, Video, ChevronLeft, Check, CheckCheck, Lock, Shield, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import AgreementSheet from '@/components/chat/AgreementSheet';
import TouchToReveal from '@/components/media/TouchToReveal';
import EphemeralMessage from '@/components/chat/EphemeralMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';
import OnlineStatus from '@/components/ui/OnlineStatus';
import PrivacyShimmer from '@/components/ui/PrivacyShimmer';
import MatchesList from '@/components/chat/MatchesList';
import { useAuth } from '@/context/AuthContext';
import { getProfile, Profile } from '@/lib/services/profiles';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { usePresence } from '@/hooks/usePresence';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';

function ChatContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const matchId = searchParams.get('match');
    const partnerId = searchParams.get('partner');

    // If no match selected, show matches list
    if (!matchId) {
        return <MatchesList />;
    }

    const { user, profile } = useAuth();

    const [inputValue, setInputValue] = useState('');
    const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
    const [showAgreementSheet, setShowAgreementSheet] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Real-time hooks
    const { messages, loading, sendMessage, markAsRead } = useRealtimeMessages(matchId);
    const { partnerPresence } = usePresence(partnerId);
    const { isPartnerTyping, setTyping } = useTypingIndicator(matchId, partnerId);

    // Load Partner Profile
    useEffect(() => {
        if (partnerId) getProfile(partnerId).then(setMatchProfile);
    }, [partnerId]);

    // Auto-scroll
    useEffect(() => {
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, [messages]);

    // Mark Read
    useEffect(() => {
        if (matchId && messages.length > 0) markAsRead();
    }, [matchId, messages, markAsRead]);

    // Handlers
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        setTyping(false);
        const success = await sendMessage(inputValue.trim(), 'text');
        if (success) setInputValue('');
    };

    const handleSendAgreement = async (terms: any) => {
        if (!matchId || !user) return;

        // Construct agreement summary
        const summary = `Proposed: ${terms.financialFrequency} arrangement (${terms.discretionLevel})`;

        // Send as special type
        await sendMessage(summary, 'agreement', terms);
        setShowAgreementSheet(false);
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
                                    <OnlineStatus status={partnerPresence?.status || 'offline'} size="sm" />
                                </div>
                            </div>
                            <div>
                                <h1 className="font-bold text-sm text-white">{matchProfile.name}</h1>
                                <OnlineStatus status={partnerPresence?.status || 'offline'} lastSeen={partnerPresence?.lastSeen} showText size="sm" />
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
                    <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={10} /> End-to-end encrypted
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-white/20" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                        <Send size={24} className="mb-2" />
                        <p className="text-sm">Start the conversation</p>
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
                                <div className={`max-w-[75%] rounded-2xl p-1 overflow-hidden ${isMe ? 'bg-[#F7E7CE] text-black rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'
                                    }`}>
                                    {/* Content based on Type */}
                                    {msg.type === 'image' && msg.media_url ? (
                                        <TouchToReveal
                                            src={msg.media_url}
                                            className="w-64 h-64"
                                            blurAmount={isMe ? 0 : 30} // Sender sees clear
                                            holdToReveal={!isMe}
                                        />
                                    ) : msg.type === 'agreement' ? (
                                        <div className="p-4 bg-black/10 rounded-xl space-y-2">
                                            <div className="flex items-center gap-2 border-b border-black/10 pb-2 mb-2">
                                                <Shield size={16} className={isMe ? "text-black/60" : "text-emerald-400"} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Proposal</span>
                                            </div>
                                            <p className="text-sm font-serif italic">"{msg.content}"</p>
                                            <div className="flex gap-2 text-[10px] opacity-60">
                                                <span className="bg-black/5 px-2 py-1 rounded">
                                                    {msg.metadata?.financialAmount || 'TBD'}
                                                </span>
                                                <span className="bg-black/5 px-2 py-1 rounded">
                                                    {msg.metadata?.meetingFrequency}
                                                </span>
                                            </div>
                                            {!isMe && (
                                                <button className="w-full mt-2 py-2 bg-black/10 rounded-lg text-xs font-bold hover:bg-black/20">
                                                    View Details
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="px-3 py-2 text-sm whitespace-pre-wrap">{msg.content}</p>
                                    )}

                                    {/* Meta */}
                                    <div className={`flex items-center gap-1 px-3 pb-2 text-[10px] ${isMe ? 'justify-end text-black/50' : 'justify-start text-white/30'}`}>
                                        <span>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            isRead ? <CheckCheck size={12} /> : <Check size={12} />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}

                <AnimatePresence>
                    {isPartnerTyping && <TypingIndicator name={matchProfile?.name} />}
                </AnimatePresence>
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/80 backdrop-blur-md border-t border-white/5 pb-8 space-y-4">
                <div className="flex items-center gap-3">
                    {/* Deal Mode Button */}
                    <button
                        onClick={() => setShowAgreementSheet(true)}
                        className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                    >
                        <Shield size={20} />
                    </button>

                    {/* Media Button */}
                    <button className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white transition-colors">
                        <ImageIcon size={20} />
                    </button>

                    <div className="flex-1 bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-[#F7E7CE]/50 transition-colors flex items-center">
                        <input
                            value={inputValue}
                            onChange={(e) => { setInputValue(e.target.value); setTyping(true); }}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent text-white placeholder:text-white/20 text-sm focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            onBlur={() => setTyping(false)}
                        />
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="w-10 h-10 rounded-full bg-[#F7E7CE] flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                    >
                        <Send size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Sheets */}
            <AgreementSheet
                isOpen={showAgreementSheet}
                onClose={() => setShowAgreementSheet(false)}
                onSubmit={handleSendAgreement}
                partnerName={matchProfile?.name || 'Partner'}
                isProvider={profile?.role === 'provider'} // Correct check using profile role
            />
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
