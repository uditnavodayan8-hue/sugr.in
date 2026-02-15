"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

import { useSugr } from '@/context/SugrContext';

export default function BottomNav() {
    const pathname = usePathname();
    const { unreadMessages, unreadMatches } = useSugr();

    // Combined count for the Chat tab
    const totalChatUnread = (unreadMessages || 0) + (unreadMatches || 0);

    const isActive = (path: string) => {
        if (path === '/discovery' && (pathname === '/discovery' || pathname.startsWith('/profile/'))) {
            return true;
        }
        if (path === '/chat' && (pathname === '/chat' || pathname.startsWith('/chat/'))) {
            return true;
        }
        return pathname === path;
    };

    const getIconColor = (path: string) => {
        return isActive(path) ? "text-primary" : "text-gray-500 hover:text-gray-300";
    };

    return (
        <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-surface-dark/95 backdrop-blur-xl border-t border-white/5 pb-4 pt-2 z-50">
            <div className="flex justify-around items-center px-2 h-16">
                <Link
                    href="/discovery"
                    className={`flex flex-col items-center gap-1 w-16 group ${getIconColor('/discovery')}`}
                >
                    <div className="relative">
                        <Icon name="style" className="text-2xl transition-all" filled={isActive('/discovery')} />
                        {isActive('/discovery') && (
                            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#f2cc0d]"></span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium mt-1">Discover</span>
                </Link>

                <Link
                    href="/board"
                    className={`flex flex-col items-center gap-1 w-16 group ${getIconColor('/board')}`}
                >
                    <Icon name="dashboard" className="text-2xl transition-all" filled={isActive('/board')} />
                    <span className="text-[10px] font-medium mt-1">Board</span>
                </Link>

                <Link
                    href="/chat"
                    className={`flex flex-col items-center gap-1 w-16 group ${getIconColor('/chat')}`}
                >
                    <div className="relative">
                        <Icon name="chat_bubble" className="text-2xl transition-all" filled={isActive('/chat')} />
                        {totalChatUnread > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full border border-background-dark flex items-center justify-center">
                                <span className="text-[9px] font-bold text-white leading-none">
                                    {totalChatUnread > 99 ? '99+' : totalChatUnread}
                                </span>
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium mt-1">Chats</span>
                </Link>

                <Link
                    href="/profile"
                    className={`flex flex-col items-center gap-1 w-16 group ${getIconColor('/profile')}`}
                >
                    <Icon name="person" className="text-2xl transition-all" filled={isActive('/profile')} />
                    <span className="text-[10px] font-medium mt-1">Profile</span>
                </Link>
            </div>
        </nav>
    );
};
