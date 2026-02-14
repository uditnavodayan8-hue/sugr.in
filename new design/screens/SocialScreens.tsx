import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

// Global store for chats to persist read status across navigation
interface ChatPreview {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
}

let globalChats: ChatPreview[] = [
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

// --- The Board ---
export const BoardScreen: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="h-screen w-full bg-background-dark flex flex-col">
            <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5 pt-12 pb-4 px-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gold-text">The Board</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Exclusive Opportunities</p>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-primary object-cover" />
                        <div className="absolute -bottom-1 -right-1 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black">9+</div>
                    </div>
                </div>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-dark border border-white/10 rounded-full text-xs font-medium text-white"><Icon name="tune" className="text-base text-primary" /> Filters</button>
                    <button className="px-4 py-2 bg-primary text-black rounded-full text-xs font-bold shadow-[0_0_10px_rgba(242,204,13,0.3)]">Near Me</button>
                    <button className="px-4 py-2 bg-surface-dark border border-white/10 rounded-full text-xs font-medium text-gray-400">Travel</button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 pt-6 pb-24 space-y-6">
                <BoardCard 
                    title="Weekend at The Leela"
                    location="Delhi" duration="2 Days"
                    desc="Seeking a charming companion for a relaxing weekend staycation. Fine dining at Le Cirque included."
                    allowance="₹30,000" perks="Spa & Dining"
                    img="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
                />
                <BoardCard 
                    title="Business Dinner Gala"
                    location="Mumbai" duration="4 Hours"
                    desc="Need a plus one for a high-profile industry awards night at The Oberoi. Elegant attire required."
                    allowance="Generous Gift" perks="Uber Black"
                    img="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop"
                    isBlackCard
                />
            </main>
             <button className="absolute bottom-24 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-[0_0_15px_rgba(242,204,13,0.4)] flex items-center justify-center z-40">
                <Icon name="add" className="text-2xl" />
            </button>
        </div>
    )
}

const BoardCard: React.FC<any> = ({ title, location, duration, desc, allowance, perks, img, isBlackCard }) => (
    <article className={`bg-surface-dark rounded-xl p-5 border ${isBlackCard ? 'border-primary/30 shadow-[0_0_15px_rgba(242,204,13,0.1)]' : 'border-white/5'} relative`}>
        {isBlackCard && (
             <div className="absolute -top-3 right-5 bg-black text-primary px-3 py-1 rounded-sm border border-primary text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                <Icon name="workspace_premium" size={10} /> Black Card
            </div>
        )}
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <Icon name="verified" className="text-primary text-sm" />
                <span className="text-xs text-primary font-bold uppercase tracking-wider">Verified Benefactor</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">2h ago</span>
        </div>
        <div className="flex items-start gap-4 mb-4">
            <img src={img} className="w-14 h-14 rounded-full object-cover border-2 border-primary/50" />
            <div>
                <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-0.5"><Icon name="location_on" size={10} /> {location}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span>{duration}</span>
                </div>
            </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-5">{desc}</p>
        <div className="flex items-center justify-between mb-6 p-3 bg-black/30 rounded-lg border border-white/5">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Allowance</span>
                <span className="text-lg font-bold text-primary">{allowance}</span>
            </div>
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">{isBlackCard ? "Transport" : "Perks"}</span>
                <span className="text-xs font-medium text-white">{perks}</span>
            </div>
        </div>
        <div className="flex gap-3">
            <button className="flex-1 bg-primary hover:bg-primary-dim text-black font-bold py-3 px-4 rounded-md text-sm transition-colors">Request to Join</button>
            <button className="aspect-square flex items-center justify-center border border-white/20 rounded-md hover:bg-white/5 text-gray-400"><Icon name="chat_bubble_outline" /></button>
        </div>
    </article>
);

// --- Chat List ---
export const ChatListScreen: React.FC<Props> = ({ onNavigate }) => {
    const [chats, setChats] = useState<ChatPreview[]>(globalChats);

    const handleChatClick = (id: string) => {
        // Mark as read in global state and local state
        const updatedChats = chats.map(c => 
            c.id === id ? { ...c, unread: false } : c
        );
        globalChats = updatedChats;
        setChats(updatedChats);
        
        // Navigate to details
        onNavigate(Screen.ChatDetail);
    };

    return (
        <div className="h-screen w-full bg-background-dark flex flex-col">
            <header className="px-6 pt-12 pb-4 border-b border-white/5 bg-background-dark/95 backdrop-blur-md">
                 <h1 className="text-2xl font-bold tracking-tight text-white mb-4">Messages</h1>
                 <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                    {/* Story Heads - Display a few friends */}
                    {globalChats.map((chat, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 min-w-[64px]">
                            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary to-transparent">
                                <img src={chat.avatar} className="w-full h-full rounded-full border-2 border-background-dark object-cover" />
                            </div>
                            <span className="text-xs text-white">{chat.name}</span>
                        </div>
                    ))}
                 </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                    <div 
                        key={chat.id} 
                        onClick={() => handleChatClick(chat.id)} 
                        className={`px-6 py-4 flex items-center gap-4 hover:bg-white/5 cursor-pointer border-l-2 transition-all ${chat.unread ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                    >
                        <div className="relative">
                            <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover border border-white/10" />
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

// --- Chat Detail ---
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

export const ChatDetailScreen: React.FC<Props> = ({ onNavigate }) => {
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
                <button onClick={() => onNavigate(Screen.ChatList)} className="text-gray-400 hover:text-white"><Icon name="arrow_back_ios_new" /></button>
                <div className="flex flex-col items-center">
                    <div className="relative">
                         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBf1DJlrxUw_QhQIBIEAQsCBEIgn1l315eON77Af6mF8jvQrXskM4SHCVqED7aNBHo94AkpfviL_Ugg3aSyT8Gp8DmkPz0I5ceC2W6ChzibOEfko2YJYBweTs01XCijUX1ZcwTQSHADG_djmWqmeYiFYJOfkfeKS6pOAqVvvbhwzGy3e537jpYJ6mGTDHKK05g4EbDmHwMu20KgLm-RVqijy9a-sL7gCQuGgkb_JZIcOpoFDg2o_LFTwa8bPDwwou8QPus0qEFtCA" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                        <div className="absolute -bottom-1 -right-1 bg-black border border-primary rounded-md px-1 py-0.5 flex items-center shadow-lg rotate-[-5deg]"><span className="text-[6px] font-bold text-primary tracking-widest leading-none">ELITE</span></div>
                    </div>
                    <div className="mt-1 text-center">
                        <h1 className="text-sm font-bold text-white">Veronica, 24</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onNavigate(Screen.VideoCall)} className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5"><Icon name="videocam" /></button>
                    <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"><Icon name="more_horiz" /></button>
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up origin-top-right">
                                <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 border-b border-white/5 flex items-center gap-2">
                                    <Icon name="person" size={16} /> View Profile
                                </button>
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
                            <img src={msg.avatar} className="w-8 h-8 rounded-full object-cover opacity-70 flex-shrink-0" />
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
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBf1DJlrxUw_QhQIBIEAQsCBEIgn1l315eON77Af6mF8jvQrXskM4SHCVqED7aNBHo94AkpfviL_Ugg3aSyT8Gp8DmkPz0I5ceC2W6ChzibOEfko2YJYBweTs01XCijUX1ZcwTQSHADG_djmWqmeYiFYJOfkfeKS6pOAqVvvbhwzGy3e537jpYJ6mGTDHKK05g4EbDmHwMu20KgLm-RVqijy9a-sL7gCQuGgkb_JZIcOpoFDg2o_LFTwa8bPDwwou8QPus0qEFtCA" className="w-8 h-8 rounded-full object-cover opacity-70" />
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
                        <input className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-500 focus:ring-0 p-2" placeholder="Message..." type="text"/>
                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gold-gradient text-black"><Icon name="send" className="text-lg transform -rotate-12 ml-1" /></button>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- Video Call Screen ---
export const VideoCallScreen: React.FC<Props> = ({ onNavigate }) => {
    const [seconds, setSeconds] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="h-screen w-full bg-black relative flex flex-col overflow-hidden">
            {/* Main Video (Remote) */}
            <img src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

            {/* Header */}
            <div className="absolute top-0 w-full pt-12 px-6 flex justify-between items-start z-10">
                 <button onClick={() => onNavigate(Screen.ChatDetail)} className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10"><Icon name="keyboard_arrow_down" /></button>
                 <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold text-white drop-shadow-md tracking-wide">Veronica</h2>
                    <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                        <Icon name="encrypted" className="text-[10px] text-primary" />
                        <span className="text-xs font-medium text-white tracking-wider">{formatTime(seconds)}</span>
                    </div>
                 </div>
                 <div className="w-10"></div> 
            </div>

            {/* Self Video (PiP) */}
            <div className="absolute top-28 right-4 w-28 h-40 bg-gray-900 rounded-xl border-2 border-white/10 overflow-hidden shadow-2xl z-20">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" />
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 w-full pb-12 pt-8 px-8 z-30 flex justify-center gap-8 items-center">
                <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className={`w-14 h-14 backdrop-blur-md rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <Icon name={isMuted ? "mic_off" : "mic"} size={24} />
                </button>
                
                <button 
                    onClick={() => onNavigate(Screen.ChatDetail)} 
                    className="w-20 h-20 bg-red-600 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-white"
                >
                    <Icon name="call_end" size={36} filled />
                </button>
                
                <button 
                    onClick={() => setIsVideoOff(!isVideoOff)} 
                    className={`w-14 h-14 backdrop-blur-md rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <Icon name={isVideoOff ? "videocam_off" : "videocam"} size={24} />
                </button>

                 <button className="absolute right-8 bottom-14 p-2 text-white/70 hover:text-white">
                    <Icon name="flip_camera_ios" size={28} />
                </button>
            </div>
        </div>
    )
}

// --- Gifts Grid ---
export const GiftsScreen: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="h-screen w-full bg-[#232010] flex flex-col">
            <header className="px-6 py-4 flex items-center gap-4 text-white">
                <button onClick={() => onNavigate(Screen.MatchReveal)}><Icon name="arrow_back" /></button>
                <h2 className="text-lg font-bold flex-1 text-center pr-6">Gifts</h2>
            </header>
            <div className="px-6 pt-2 pb-4"><h2 className="text-white text-[22px] font-bold">Premium Gifts</h2></div>
            <main className="flex-1 overflow-y-auto px-4 space-y-4 pb-12">
                {[
                    {name: "Sabyasachi Accessories", cost: 100, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMhiiwhRRdqU_aF-HQo5zvO6RzQQy9eVPRdl2meniXMjNn081wBpILC9_0R32QqhbOyLOANIECzyO-I9TjTWtQBusFRzoQqNmaVPAscX_uIcUoY20lKFSPRztXkusQZ6oVFn8RX-s-0h93keX30uHr5yYBsTvg2nJHZA5haiDhuQ_nv9PFCqNefZCgYDsX7QNLHPXWI56d-JHdlg-Pym6Vh74YnTdCY8OYDIxd4PpZCncC7vNWHBOFDRa-GJ5M3CAx1J6SfFJlOVg"},
                    {name: "Premium Taj Staycation", cost: 250, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBERbzl4cgBVwBpSzaSZa5mMOpdM7WcuPAp1pJfguEQ2mtOJPeFI5xGSEBTu036wUs7pr-eA_Tq81G6KPrqzc5DJ3HO0-bV1AaHARg1Cfcy0IamAgnlEVf1y1M0C8_RhC6Qv3Vp86FmZmVI5yEOCXCCfT8VI60M4GFs_SNbVbloydmGqXCMhLQsoJw0tupfUSvDRG45bGQ1UCRANa1WX0KSqpNu2itVUclws3f3vZse5NDRlG8bfneiFduGNoR-G6ra2pj5L3Pj7GY"},
                    {name: "Artisanal Hampers", cost: 50, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQlXgxnB798EuIIgzSvict0CtCLNQWvTVjTUzePARHuPlhm6VYhJCCAhEFA1-Dx78JnbEf52dHsKGyIaGLrkUSik25yrbIp2dw7T3x6qj49SSxaE6xbaXNIdwL7A0w9n8mYv7SwwqU0OJh9cWg-88XMIm4dggdjntVSj4ij3qqE7Y_YPOL1GLI5Bu4uu99ix-LKZ974FDLADlllV-nm391qBDkcIYP-ONiCoodG1rWSk-FIApahGEAiIitkVpnKDmIWSzMaYkDxmo"},
                ].map((gift, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-[#342f18] rounded-xl border border-white/5">
                        <div className="flex-1 flex flex-col justify-center gap-2">
                            <p className="text-[#cbc190] text-sm">{gift.name}</p>
                            <p className="text-white font-bold">{gift.name}</p>
                            <p className="text-[#cbc190] text-sm">Gold Credit: {gift.cost}</p>
                            <button className="mt-2 bg-[#494222] text-white px-4 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2">Send Anonymously <Icon name="toggle_on" /></button>
                        </div>
                        <img src={gift.img} className="w-24 h-24 rounded-lg object-cover bg-gray-800" />
                    </div>
                ))}
            </main>
        </div>
    )
}