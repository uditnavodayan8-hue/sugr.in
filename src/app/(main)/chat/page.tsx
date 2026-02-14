"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { getChats } from '@/lib/services/chat';
import { toast } from 'sonner';

interface ChatPreview {
    id: string; // Match ID
    partnerId: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: boolean;
    online: boolean;
}

// Helper for time formatting
function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ChatListPage() {
    const router = useRouter();
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChats();
        // TODO: Real-time updates for chat list (new messages modifying the list)
        // This requires a subscription to 'messages' table filtered by user's matches... complex.
        // For MVP, we load on mount.
    }, []);

    const loadChats = async () => {
        try {
            const data = await getChats();
            setChats(data.map(c => ({
                ...c,
                avatar: c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
            })));
        } catch (error) {
            console.error(error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = (id: string) => {
        router.push(`/chat/${id}`);
    };

    return (
        <div className="h-screen w-full bg-background-dark flex flex-col">
            <header className="px-6 pt-12 pb-4 border-b border-white/5 bg-background-dark/95 backdrop-blur-md">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-4">Messages</h1>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                    {/* Story Heads - Display recent active chats */}
                    {loading ? (
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-16 h-16 rounded-full bg-white/5 animate-pulse"></div>)}
                        </div>
                    ) : chats.slice(0, 5).map((chat, i) => (
                        <div key={chat.id} className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer" onClick={() => handleChatClick(chat.id)}>
                            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary to-transparent">
                                <img src={chat.avatar} className="w-full h-full rounded-full border-2 border-background-dark object-cover" alt={chat.name} />
                            </div>
                            <span className="text-xs text-white truncate w-16 text-center">{chat.name}</span>
                        </div>
                    ))}
                </div>
            </header>
            <main className="flex-1 overflow-y-auto pb-24">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading conversations...</div>
                ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Icon name="chat_bubble_outline" className="text-4xl mb-2 opacity-50" />
                        <p>No matches yet.</p>
                        <button onClick={() => router.push('/discovery')} className="mt-4 text-primary text-sm font-bold">Find Matches</button>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleChatClick(chat.id)}
                            className={`px-6 py-4 flex items-center gap-4 hover:bg-white/5 cursor-pointer border-l-2 transition-all ${chat.unread ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                        >
                            <div className="relative">
                                <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover border border-white/10" alt={chat.name} />
                                {chat.online && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background-dark rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`text-lg text-white ${chat.unread ? 'font-bold' : 'font-medium'}`}>{chat.name}</h3>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-xs ${chat.unread ? 'text-primary font-bold' : 'text-gray-500 font-medium'}`}>{formatTime(chat.time)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-sm truncate pr-2 ${chat.unread ? 'text-white font-medium' : 'text-gray-400'}`}>{chat.lastMessage}</p>
                                    {chat.unread && (
                                        <span className="flex-shrink-0 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(242,204,13,0.6)] animate-pulse"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    )
}
