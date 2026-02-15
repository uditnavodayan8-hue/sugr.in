'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSugr } from '@/context/SugrContext';
import { Icon } from '@/components/ui/Icon';
import { reportUser, blockUser } from '@/lib/services/safety';
import { getMessages, sendMessage, Message } from '@/lib/services/chat';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';

interface UIMessage {
    id: string;
    sender: 'me' | 'other';
    sender_id: string;
    content: string;
    isTemp?: boolean;
    timestamp: string;
}

export default function ChatDetailPage() {
    const router = useRouter();
    const params = useParams();
    const matchId = params.id as string;
    const { user } = useSugr();
    const supabase = createClient();

    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load initial messages
    useEffect(() => {
        if (!user || !matchId) return;

        const loadMessages = async () => {
            setLoading(true);
            const msgs = await getMessages(matchId);
            const uiMsgs: UIMessage[] = msgs.map(m => ({
                id: m.id,
                sender: m.sender_id === user.id ? 'me' : 'other',
                sender_id: m.sender_id,
                content: m.content || '',
                timestamp: m.created_at
            }));
            setMessages(uiMsgs);
            setLoading(false);
        };

        loadMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`chat-${matchId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `match_id=eq.${matchId}`
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    if (newMsg.sender_id !== user.id) {
                        setMessages(prev => [...prev, {
                            id: newMsg.id,
                            sender: 'other',
                            sender_id: newMsg.sender_id,
                            content: newMsg.content || '',
                            timestamp: newMsg.created_at
                        }]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, matchId, supabase]);

    const handleSend = async () => {
        if (!inputText.trim() || sending || !user) return;

        const content = inputText.trim();
        setInputText('');
        setSending(true);

        try {
            // Optimistic update
            const tempId = Date.now().toString();
            setMessages(prev => [...prev, {
                id: tempId,
                sender: 'me',
                sender_id: user.id,
                content: content,
                isTemp: true,
                timestamp: new Date().toISOString()
            }]);

            const newMsg = await sendMessage(matchId, content);

            if (newMsg) {
                // Replace temp message
                setMessages(prev => prev.map(m =>
                    m.id === tempId ? {
                        id: newMsg.id,
                        sender: 'me',
                        sender_id: newMsg.sender_id,
                        content: newMsg.content || '',
                        timestamp: newMsg.created_at
                    } : m
                ));
            }
        } catch (error) {
            console.error('Failed to send', error);
            toast.error('Failed to send message');
            // Remove temp message on failure
            setMessages(prev => prev.filter(m => m.isTemp !== true));
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleReport = async () => {
        const otherUserId = messages.find(m => m.sender === 'other')?.sender_id;
        if (!otherUserId) {
            toast.error('Cannot report user without messages');
            return;
        }
        const reason = prompt('Reason for reporting:');
        if (!reason) return;

        try {
            await reportUser(otherUserId, reason);
            toast.success('User reported.');
            setShowMenu(false);
        } catch (error) {
            toast.error('Failed to report user');
        }
    };

    const handleBlock = async () => {
        const otherUserId = messages.find(m => m.sender === 'other')?.sender_id;
        if (!otherUserId) {
            toast.error('Cannot block user without messages');
            return;
        }
        if (!confirm('Block this user?')) return;

        try {
            await blockUser(otherUserId);
            toast.success('User blocked');
            router.push('/chat');
        } catch (error) {
            toast.error('Failed to block user');
        }
    };

    return (
        <div className="h-screen w-full bg-background-dark flex flex-col">
            <header className="flex items-center justify-between px-5 pt-12 pb-4 z-20 bg-background-dark/95 border-b border-white/5 backdrop-blur-md">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-white"><Icon name="arrow_back_ios_new" /></button>
                <div className="flex flex-col items-center">
                    <div className="mt-1 text-center">
                        <Link href={`/profile/${messages.find(m => m.sender === 'other')?.sender_id || '#'}`} className="text-sm font-bold text-white hover:underline">
                            Chat
                        </Link>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"
                    >
                        <Icon name="more_horiz" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-10 w-40 bg-surface-dark border border-white/10 rounded-xl shadow-xl py-1 z-50">
                            <button onClick={handleReport} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-2">
                                <Icon name="flag" className="text-xs text-gray-400" /> Report
                            </button>
                            <button onClick={handleBlock} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                                <Icon name="block" className="text-xs" /> Block
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={msg.id || idx}
                            className={`flex ${msg.sender === 'me' ? 'flex-row-reverse' : 'items-end'} gap-3 relative group select-none`}
                        >
                            <div className={`${msg.sender === 'me' ? 'bg-primary/10 border border-primary/50 text-white shadow-[0_0_15px_-5px_rgba(242,204,13,0.15)] rounded-br-sm' : 'bg-surface-dark border border-white/10 text-gray-200 rounded-bl-sm'} p-4 rounded-2xl text-sm transition-transform active:scale-[0.98] max-w-[75%] ${msg.isTemp ? 'opacity-70' : ''}`}>
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </main>

            <div className="px-4 pb-6 pt-2 bg-background-dark">
                <div className="flex items-center gap-2 p-1.5 bg-[#151515] border border-white/10 rounded-full">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary bg-primary/10"><Icon name="add_circle_outline" /></button>
                    <input
                        className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-500 focus:ring-0 p-2 outline-none"
                        placeholder="Message..."
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending || !inputText.trim()}
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-gold-gradient text-black transition-opacity ${(!inputText.trim() || sending) ? 'opacity-50' : ''}`}
                    >
                        <Icon name="send" className="text-lg transform -rotate-12 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    )
}
