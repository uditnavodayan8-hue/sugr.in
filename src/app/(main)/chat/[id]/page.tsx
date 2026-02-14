"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
    avatar?: string;
    isGift?: boolean;
    isPrivateMedia?: boolean;
    reactions: string[];
}

export default function ChatDetailPage() {
    const router = useRouter();
    const params = useParams(); // In a real app, use params.id to fetch chat
    const { id } = params;

    const [isTyping, setIsTyping] = useState(true);
    const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: "I saw you were in Monaco last week. The view from the Casino is absolutely breathtaking.",
            sender: 'other',
            timestamp: '10:23 PM',
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBf1DJlrxUw_QhQIBIEAQsCBEIgn1l315eON77Af6mF8jvQrXskM4SHCVqED7aNBHo94AkpfviL_Ugg3aSyT8Gp8DmkPz0I5ceC2W6ChzibOEfko2YJYBweTs01XCijUX1ZcwTQSHADG_djmWqmeYiFYJOfkfeKS6pOAqVvvbhwzGy3e537jpYJ6mGTDHKK05g4EbDmHwMu20KgLm-RVqijy9a-sL7gCQuGgkb_JZIcOpoFDg2o_LFTwa8bPDwwou8QPus0qEFtCA",
            reactions: []
        },
        {
            id: '2',
            text: "It was incredible, yes. Perhaps we can go together next time.",
            sender: 'me',
            timestamp: '10:25 PM',
            reactions: ['❤️']
        },
        {
            id: '3',
            isGift: true,
            text: "You sent a Premium Champagne Gift",
            sender: 'me',
            timestamp: '10:26 PM',
            reactions: ['🍾']
        },
        {
            id: '4',
            isPrivateMedia: true,
            sender: 'other',
            timestamp: '10:30 PM',
            text: "Private Media",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBf1DJlrxUw_QhQIBIEAQsCBEIgn1l315eON77Af6mF8jvQrXskM4SHCVqED7aNBHo94AkpfviL_Ugg3aSyT8Gp8DmkPz0I5ceC2W6ChzibOEfko2YJYBweTs01XCijUX1ZcwTQSHADG_djmWqmeYiFYJOfkfeKS6pOAqVvvbhwzGy3e537jpYJ6mGTDHKK05g4EbDmHwMu20KgLm-RVqijy9a-sL7gCQuGgkb_JZIcOpoFDg2o_LFTwa8bPDwwou8QPus0qEFtCA",
            reactions: []
        }
    ]);

    const toggleReaction = (msgId: string, emoji: string) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === msgId) {
                const exists = msg.reactions.includes(emoji);
                return {
                    ...msg,
                    reactions: exists ? msg.reactions.filter(r => r !== emoji) : [...msg.reactions, emoji]
                };
            }
            return msg;
        }));
        setActiveReactionId(null);
    };

    const handleBlock = () => {
        setIsBlocked(true);
        setShowMenu(false);
    };

    const startLongPress = (id: string) => {
        const timer = setTimeout(() => {
            setActiveReactionId(id);
            if (window.navigator?.vibrate) {
                window.navigator.vibrate(50);
            }
        }, 500);
        setLongPressTimer(timer);
    };

    const cancelLongPress = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    return (
        <div className="h-screen w-full bg-background-dark flex flex-col" onClick={() => { setActiveReactionId(null); setShowMenu(false); }}>
            <header className="flex items-center justify-between px-5 pt-12 pb-4 z-20 bg-background-dark/95 border-b border-white/5 backdrop-blur-md">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-white"><Icon name="arrow_back_ios_new" /></button>
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBf1DJlrxUw_QhQIBIEAQsCBEIgn1l315eON77Af6mF8jvQrXskM4SHCVqED7aNBHo94AkpfviL_Ugg3aSyT8Gp8DmkPz0I5ceC2W6ChzibOEfko2YJYBweTs01XCijUX1ZcwTQSHADG_djmWqmeYiFYJOfkfeKS6pOAqVvvbhwzGy3e537jpYJ6mGTDHKK05g4EbDmHwMu20KgLm-RVqijy9a-sL7gCQuGgkb_JZIcOpoFDg2o_LFTwa8bPDwwou8QPus0qEFtCA" className="w-10 h-10 rounded-full object-cover border border-white/10" alt="Avatar" />
                        <div className="absolute -bottom-1 -right-1 bg-black border border-primary rounded-md px-1 py-0.5 flex items-center shadow-lg rotate-[-5deg]"><span className="text-[6px] font-bold text-primary tracking-widest leading-none">ELITE</span></div>
                    </div>
                    <div className="mt-1 text-center">
                        <h1 className="text-sm font-bold text-white">Veronica, 24</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => router.push(`/call/${id}`)} className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5"><Icon name="videocam" /></button>
                    <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"><Icon name="more_horiz" /></button>
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up origin-top-right">
                                <Link
                                    href={`/profile/${id}`} // Assuming profile dynamic route
                                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 border-b border-white/5 flex items-center gap-2"
                                >
                                    <Icon name="person" size={16} /> View Profile
                                </Link>
                                <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 border-b border-white/5 flex items-center gap-2">
                                    <Icon name="flag" size={16} /> Report
                                </button>
                                <button onClick={handleBlock} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                                    <Icon name="block" size={16} /> Block User
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <div className="flex justify-center"><span className="text-xs text-gray-500 font-medium tracking-wide">TODAY 10:23 PM</span></div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isGift ? 'justify-center my-6' : msg.sender === 'me' ? 'flex-row-reverse' : 'items-end'} gap-3 relative group select-none`}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {/* Avatar (only for 'other') */}
                        {msg.sender === 'other' && !msg.isGift && (
                            <img src={msg.avatar} className="w-8 h-8 rounded-full object-cover opacity-70 flex-shrink-0" alt="Avatar" />
                        )}

                        {/* Message Content */}
                        {msg.isGift ? (
                            <div className="bg-gradient-to-r from-transparent via-primary/10 to-transparent w-full py-2 flex justify-center items-center gap-2">
                                <span className="text-lg">🍾</span>
                                <span className="text-xs text-primary font-medium tracking-wide uppercase">{msg.text}</span>
                                <div className="flex gap-1 ml-2">
                                    {msg.reactions.map((r, i) => (
                                        <span key={i} className="text-sm animate-fade-in-up">{r}</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div
                                className="max-w-[75%] relative"
                                onTouchStart={() => startLongPress(msg.id)}
                                onTouchEnd={cancelLongPress}
                                onTouchMove={cancelLongPress}
                                onMouseDown={() => startLongPress(msg.id)}
                                onMouseUp={cancelLongPress}
                                onMouseLeave={cancelLongPress}
                            >
                                {/* Reaction Picker Popup (Above Message) */}
                                {activeReactionId === msg.id && (
                                    <div className={`absolute -top-14 ${msg.sender === 'me' ? 'right-0' : 'left-0'} z-30 bg-[#252525]/95 backdrop-blur-xl border border-white/10 rounded-full p-2 flex gap-2 shadow-2xl animate-fade-in-up origin-bottom`}>
                                        {['❤️', '🔥', '😂', '😮', '👍'].map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={(e) => { e.stopPropagation(); toggleReaction(msg.id, emoji); }}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-all text-xl hover:scale-110 active:scale-95"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {msg.isPrivateMedia ? (
                                    <div className="bg-surface-dark border border-white/10 p-1.5 rounded-2xl rounded-bl-sm overflow-hidden">
                                        <div className="relative w-full h-48 rounded-xl bg-gray-900 flex flex-col items-center justify-center">
                                            <Icon name="lock" className="text-white/70 mb-2" />
                                            <span className="text-xs font-bold text-white tracking-wider mb-1">PRIVATE MEDIA</span>
                                            <button className="mt-2 bg-white/10 border border-white/20 text-white text-xs py-1.5 px-4 rounded-full">Request Access</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`${msg.sender === 'me' ? 'bg-primary/10 border border-primary/50 text-white shadow-[0_0_15px_-5px_rgba(242,204,13,0.15)] rounded-br-sm' : 'bg-surface-dark border border-white/10 text-gray-200 rounded-bl-sm'} p-4 rounded-2xl text-sm transition-transform active:scale-[0.98]`}>
                                        <p>{msg.text}</p>
                                    </div>
                                )}

                                {/* Reactions Display */}
                                <div className={`flex gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.reactions.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {msg.reactions.map((reaction, i) => (
                                                <button
                                                    key={i}
                                                    className="bg-surface-dark border border-white/10 rounded-full px-2 py-0.5 text-xs animate-fade-in-up hover:bg-white/5"
                                                >
                                                    {reaction}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Typing Indicator */}
                {!isBlocked && isTyping && (
                    <div className="flex items-end gap-3 animate-fade-in-up">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBf1DJlrxUw_QhQIBIEAQsCBEIgn1l315eON77Af6mF8jvQrXskM4SHCVqED7aNBHo94AkpfviL_Ugg3aSyT8Gp8DmkPz0I5ceC2W6ChzibOEfko2YJYBweTs01XCijUX1ZcwTQSHADG_djmWqmeYiFYJOfkfeKS6pOAqVvvbhwzGy3e537jpYJ6mGTDHKK05g4EbDmHwMu20KgLm-RVqijy9a-sL7gCQuGgkb_JZIcOpoFDg2o_LFTwa8bPDwwou8QPus0qEFtCA" className="w-8 h-8 rounded-full object-cover opacity-70" alt="Avatar" />
                        <div className="bg-surface-dark border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {isBlocked ? (
                <div className="px-6 py-8 bg-surface-dark border-t border-white/5 text-center animate-fade-in-up">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="block" className="text-red-500" />
                    </div>
                    <p className="text-white font-bold mb-1">You blocked this user</p>
                    <p className="text-xs text-gray-500 mb-4">You can no longer send or receive messages from Veronica.</p>
                    <button onClick={() => setIsBlocked(false)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium hover:bg-white/10 text-white">Unblock</button>
                </div>
            ) : (
                <div className="px-4 pb-6 pt-2 bg-background-dark">
                    <div className="flex items-center gap-2 p-1.5 bg-[#151515] border border-white/10 rounded-full">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary bg-primary/10"><Icon name="add_circle_outline" /></button>
                        <input className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-500 focus:ring-0 p-2 outline-none" placeholder="Message..." type="text" />
                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gold-gradient text-black"><Icon name="send" className="text-lg transform -rotate-12 ml-1" /></button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Add Link to React imports if it's missing or use router.push for the link in menu
import Link from 'next/link';
