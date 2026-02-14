"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';
import { getMessages, sendMessage, type Message } from '@/lib/services/chat';
import { subscribeToMessages } from '@/lib/services/chat.client';
import { toast } from 'sonner';

// Extended message interface for UI state
interface UIMessage extends Message {
    sender: 'me' | 'other';
    isTemp?: boolean;
}

export default function ChatDetailPage() {
    const router = useRouter();
    const params = useParams();
    const matchId = params.id as string;
    const { user } = useUser();

    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user || !matchId) return;

        loadMessages();

        const unsubscribe = subscribeToMessages(matchId, (newMessage) => {
            if (newMessage.sender_id !== user.id) {
                // Add received message
                setMessages(prev => [...prev, { ...newMessage, sender: 'other' }]);
                scrollToBottom();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [user, matchId]);

    const loadMessages = async () => {
        if (!user) return;
        try {
            const data = await getMessages(matchId);
            setMessages(data.map(m => ({
                ...m,
                sender: m.sender_id === user.id ? 'me' : 'other'
            })));
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !user) return;

        const text = inputText.trim();
        setInputText('');
        setSending(true);

        // Optimistic update
        const tempId = Date.now().toString();
        const tempMsg: UIMessage = {
            id: tempId,
            match_id: matchId,
            sender_id: user.id,
            content: text,
            media_url: null,
            is_one_time_view: false,
            viewed_at: null,
            created_at: new Date().toISOString(),
            sender: 'me',
            isTemp: true
        };

        setMessages(prev => [...prev, tempMsg]);
        scrollToBottom();

        try {
            const sentMsg = await sendMessage(matchId, text);
            if (sentMsg) {
                // Replace temp message with real one
                setMessages(prev => prev.map(m => m.id === tempId ? { ...sentMsg, sender: 'me' } : m));
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to send message');
            // Remove temp message
            setMessages(prev => prev.filter(m => m.id !== tempId));
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

    return (
        <div className="h-screen w-full bg-background-dark flex flex-col">
            <header className="flex items-center justify-between px-5 pt-12 pb-4 z-20 bg-background-dark/95 border-b border-white/5 backdrop-blur-md">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-white"><Icon name="arrow_back_ios_new" /></button>
                <div className="flex flex-col items-center">
                    <div className="mt-1 text-center">
                        <h1 className="text-sm font-bold text-white">Chat</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"><Icon name="more_horiz" /></button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
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
