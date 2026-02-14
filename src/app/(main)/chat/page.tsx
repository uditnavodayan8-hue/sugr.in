"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

interface ChatPreview {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: boolean;
    online: boolean;
}

const initialChats: ChatPreview[] = [
    {
        id: '1',
        name: 'Veronica',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBf1DJlrxUw_QhQIBIEAQsCBEIgn1l315eON77Af6mF8jvQrXskM4SHCVqED7aNBHo94AkpfviL_Ugg3aSyT8Gp8DmkPz0I5ceC2W6ChzibOEfko2YJYBweTs01XCijUX1ZcwTQSHADG_djmWqmeYiFYJOfkfeKS6pOAqVvvbhwzGy3e537jpYJ6mGTDHKK05g4EbDmHwMu20KgLm-RVqijy9a-sL7gCQuGgkb_JZIcOpoFDg2o_LFTwa8bPDwwou8QPus0qEFtCA',
        lastMessage: 'It was incredible, yes. Perhaps we can...',
        time: '10:30 PM',
        unread: true,
        online: true
    },
    {
        id: '2',
        name: 'Elena',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
        lastMessage: 'Looking forward to the gala!',
        time: 'Yesterday',
        unread: false,
        online: false
    },
    {
        id: '3',
        name: 'Sofia',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
        lastMessage: 'Thank you for the gift! ❤️',
        time: 'Mon',
        unread: true,
        online: true
    },
    {
        id: '4',
        name: 'Isabella',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
        lastMessage: 'Can you send the details?',
        time: 'Sun',
        unread: false,
        online: true
    }
];

export default function ChatListPage() {
    const router = useRouter();
    const [chats, setChats] = useState<ChatPreview[]>(initialChats);

    const handleChatClick = (id: string) => {
        // Mark as read in local state
        const updatedChats = chats.map(c =>
            c.id === id ? { ...c, unread: false } : c
        );
        setChats(updatedChats);

        // Navigate to details
        router.push(`/chat/${id}`);
    };

    return (
        <div className="h-screen w-full bg-background-dark flex flex-col">
            <header className="px-6 pt-12 pb-4 border-b border-white/5 bg-background-dark/95 backdrop-blur-md">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-4">Messages</h1>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                    {/* Story Heads - Display a few friends */}
                    {chats.map((chat, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 min-w-[64px]">
                            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary to-transparent">
                                <img src={chat.avatar} className="w-full h-full rounded-full border-2 border-background-dark object-cover" alt={chat.name} />
                            </div>
                            <span className="text-xs text-white">{chat.name}</span>
                        </div>
                    ))}
                </div>
            </header>
            <main className="flex-1 overflow-y-auto pb-24">
                {chats.map((chat) => (
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
                                    <span className={`text-xs ${chat.unread ? 'text-primary font-bold' : 'text-gray-500 font-medium'}`}>{chat.time}</span>
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
                ))}
            </main>
        </div>
    )
}
