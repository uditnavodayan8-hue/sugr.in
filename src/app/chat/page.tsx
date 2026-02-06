'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getMatch, getMatches, Match } from '@/lib/services/matches';
import { getProfile, Profile } from '@/lib/services/profiles';
import { useChat } from '@/hooks/useChat';
import Link from 'next/link';
import { ArrowLeft, Loader2, MessageCircle, Send, ChevronRight, FileText, ShieldAlert, Plus, Lock, Eye, Flame } from 'lucide-react';
import DealSheet from '@/components/chat/DealSheet';
import EphemeralMessage from '@/components/chat/EphemeralMessage';
import { useScreenshotGuard } from '@/hooks/useScreenshotGuard';

function ChatContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const matchId = searchParams.get('match');

    const { user } = useAuth();
    const [matches, setMatches] = useState<(Match & { partner?: Profile })[]>([]);
    const [loadingMatches, setLoadingMatches] = useState(true);

    const [partner, setPartner] = useState<Profile | null>(null);
    const [loadingPartner, setLoadingPartner] = useState(true);
    const [text, setText] = useState('');
    const [showDealSheet, setShowDealSheet] = useState(false);
    const [showPlusMenu, setShowPlusMenu] = useState(false);
    const [isEphemeralMode, setIsEphemeralMode] = useState(false);

    const { isBlurred, guardStyles } = useScreenshotGuard({ enabled: true });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load matches list
    useEffect(() => {
        if (!user || matchId) return;

        const loadMatches = async () => {
            setLoadingMatches(true);
            try {
                const data = await getMatches(user.id);
                const enriched = await Promise.all(data.map(async (m) => {
                    const partnerId = m.user_a === user.id ? m.user_b : m.user_a;
                    const p = await getProfile(partnerId);
                    return { ...m, partner: p ?? undefined };
                }));
                setMatches(enriched);
            } catch (err) {
                console.error('Error loading matches:', err);
            } finally {
                setLoadingMatches(false);
            }
        };
        loadMatches();
    }, [user, matchId]);

    // Load partner
    useEffect(() => {
        if (!user || !matchId) {
            setLoadingPartner(false);
            return;
        }

        const loadPartner = async () => {
            try {
                const match = await getMatch(matchId);
                if (match) {
                    const partnerId = match.user_a === user.id ? match.user_b : match.user_a;
                    const partnerProfile = await getProfile(partnerId);
                    setPartner(partnerProfile);
                }
            } catch (err) {
                console.error('Error loading partner:', err);
            } finally {
                setLoadingPartner(false);
            }
        };
        loadPartner();
    }, [user, matchId]);

    const { messages, loading: loadingMessages, sendMessage, markAsViewed } = useChat(
        matchId || '',
        partner?.name,
        partner?.avatar_url || undefined
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim()) return;

        const success = await sendMessage(text, isEphemeralMode);
        if (success) {
            setText('');
            if (isEphemeralMode) setIsEphemeralMode(false); // Reset after send
        }
    };

    // RENDER: CHAT LIST
    if (!matchId) {
        return (
            <main className="fixed inset-0 bg-[#0A0A0A] text-white pb-24">
                {/* Header */}
                <header className="px-8 pt-14 pb-4">
                    <h1 className="text-[34px] font-bold tracking-tight">Messages</h1>
                </header>

                {/* List */}
                <div className="px-4 space-y-2">
                    {loadingMatches && (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
                        </div>
                    )}

                    {!loadingMatches && matches.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <MessageCircle className="w-7 h-7 text-white/30" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-[22px] font-semibold mb-2">No Messages</h2>
                            <p className="text-[15px] text-white/40 mb-8 max-w-[260px]">
                                Start matching to begin conversations
                            </p>
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 rounded-full bg-[#F7E7CE] text-[#0A0A0A] font-semibold text-[15px]"
                            >
                                Discover People
                            </Link>
                        </motion.div>
                    )}

                    {matches.map((m, i) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/chat?match=${m.id}`}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] active:scale-[0.98] transition-all"
                            >
                                <img
                                    src={m.partner?.avatar_url || 'https://via.placeholder.com/56'}
                                    className="w-14 h-14 rounded-full object-cover"
                                    alt={m.partner?.name}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <h3 className="text-[17px] font-semibold truncate">{m.partner?.name}</h3>
                                        <span className="text-[13px] text-white/30 ml-2">
                                            {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-[15px] text-white/40 truncate">
                                        Tap to continue conversation
                                    </p>
                                </div>
                                <ChevronRight size={20} className="text-white/20 flex-shrink-0" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
        );
    }

    // RENDER: CONVERSATION
    if (loadingPartner) {
        return (
            <main className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#F7E7CE]" />
            </main>
        );
    }

    return (
        <main className="fixed inset-0 bg-[#0A0A0A] text-white flex flex-col">
            <AnimatePresence>
                {showDealSheet && partner && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60]"
                    >
                        <DealSheet
                            partnerName={partner.name || 'Partner'}
                            onClose={() => setShowDealSheet(false)}
                            onSeal={() => {
                                setShowDealSheet(false);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Screenshot Protection Overlay */}
            <AnimatePresence>
                {isBlurred && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <ShieldAlert size={28} className="text-[#F7E7CE]" />
                            </div>
                            <p className="text-[15px] text-white/60">Content Protected</p>
                            <p className="text-[12px] text-white/30 mt-1">Return to view messages</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
                <button
                    onClick={() => router.push('/chat')}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                >
                    <ArrowLeft size={20} strokeWidth={1.5} />
                </button>

                {partner && (
                    <div className="flex items-center gap-3 flex-1">
                        <img
                            src={partner.avatar_url || ''}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                            alt={partner.name}
                        />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-[17px] font-semibold truncate">{partner.name}</h2>
                            <p className="text-[12px] text-white/40 leading-none mt-0.5">{partner.role}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowDealSheet(true)}
                        className="w-10 h-10 rounded-full bg-[#F7E7CE]/10 border border-[#F7E7CE]/20 flex items-center justify-center text-[#F7E7CE] hover:bg-[#F7E7CE]/20 transition-all"
                    >
                        <FileText size={18} strokeWidth={1.5} />
                    </button>
                    <button
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <ShieldAlert size={18} strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 no-scrollbar">
                {loadingMessages && messages.length === 0 && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-white/30" />
                    </div>
                )}

                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className={cn("flex", msg.isMe ? "justify-end" : "justify-start")}
                    >
                        {msg.is_one_time_view ? (
                            <EphemeralMessage
                                id={msg.id}
                                content={msg.content}
                                type="text"
                                isMe={msg.isMe}
                                isViewed={!!msg.viewed_at}
                                onView={markAsViewed}
                            />
                        ) : (
                            <div className={cn(
                                "max-w-[75%] px-4 py-2.5 rounded-[22px] shadow-sm",
                                msg.isMe
                                    ? "bg-[#F7E7CE] text-[#0A0A0A] rounded-tr-none"
                                    : "bg-white/[0.08] text-white rounded-tl-none"
                            )}>
                                <p className="text-[15px] leading-[1.4]">{msg.content}</p>
                            </div>
                        )}
                    </motion.div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-4 pb-8 border-t border-white/[0.06] bg-[#0A0A0A] relative">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPlusMenu(!showPlusMenu)}
                        className={cn(
                            "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                            showPlusMenu ? "bg-white/20 rotate-45" : "bg-white/5"
                        )}
                    >
                        <Plus size={22} strokeWidth={1.5} />
                    </button>

                    {/* Ephemeral Mode Toggle */}
                    <button
                        onClick={() => setIsEphemeralMode(!isEphemeralMode)}
                        className={cn(
                            "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                            isEphemeralMode
                                ? "bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-red-500/50 text-red-400"
                                : "bg-white/5 text-white/40"
                        )}
                    >
                        <Flame size={20} strokeWidth={1.5} />
                    </button>

                    <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-3xl bg-white/[0.06] border border-white/[0.08] focus-within:border-white/20 transition-all">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Message..."
                            className="flex-1 bg-transparent text-[16px] text-white placeholder:text-white/20 focus:outline-none"
                        />
                        {text.trim() && (
                            <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={handleSend}
                                className="w-9 h-9 rounded-full bg-[#F7E7CE] flex items-center justify-center text-[#0A0A0A] hover:scale-105 active:scale-95 transition-all shadow-lg"
                            >
                                <Send size={18} strokeWidth={2.5} />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Plus Menu Popover */}
                <AnimatePresence>
                    {showPlusMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-24 left-4 w-56 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl p-2 z-[60]"
                        >
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <MessageCircle size={16} />
                                </div>
                                <span className="text-[14px]">Send Media</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
                                <div className="w-8 h-8 rounded-full bg-[#F7E7CE]/20 flex items-center justify-center text-[#F7E7CE]">
                                    <Lock size={16} />
                                </div>
                                <span className="text-[14px]">Request Vault</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <main className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#F7E7CE]" />
            </main>
        }>
            <ChatContent />
        </Suspense>
    );
}
