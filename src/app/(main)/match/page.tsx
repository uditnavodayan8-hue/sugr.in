"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function MatchRevealPage() {
    const router = useRouter();

    return (
        <div className="absolute inset-0 z-50 bg-background-dark flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none"></div>

            {/* Confetti (Simple CSS representation) */}
            {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-2 h-2 bg-primary opacity-60 rounded-sm" style={{
                    top: `${Math.random() * 50}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`
                }}></div>
            ))}

            <nav className="absolute top-0 w-full px-6 pt-12 pb-4 flex justify-end">
                <button onClick={() => router.push('/discovery')} className="text-white/60 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-sm font-medium tracking-wide uppercase">Keep Browsing</span>
                    <Icon name="close" />
                </button>
            </nav>

            <div className="text-center mb-10 space-y-2 z-10 px-6">
                <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gold-text drop-shadow-sm">It's a Golden Match</h1>
                <div className="h-0.5 w-16 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"></div>
            </div>

            <div className="relative w-full h-48 flex justify-center items-center mb-12">
                {/* User A */}
                <div className="absolute left-1/2 -translate-x-[85%] z-10 transform hover:scale-105 transition-transform duration-500">
                    <div className="bg-gradient-to-br from-[#b09304] via-[#f9e47e] to-[#f2cc0d] rounded-full p-[3px] shadow-2xl">
                        <div className="bg-black rounded-full p-[2px]">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" className="w-32 h-32 rounded-full object-cover" alt="User A" />
                        </div>
                    </div>
                </div>

                {/* Heart Icon */}
                <div className="absolute left-1/2 -translate-x-1/2 z-30">
                    <div className="bg-primary rounded-full p-2 shadow-lg shadow-primary/20 border-4 border-background-dark">
                        <Icon name="favorite" className="text-background-dark text-xl" filled />
                    </div>
                </div>

                {/* User B */}
                <div className="absolute right-1/2 translate-x-[85%] z-20 transform hover:scale-105 transition-transform duration-500">
                    <div className="bg-gradient-to-br from-[#b09304] via-[#f9e47e] to-[#f2cc0d] rounded-full p-[3px] shadow-2xl">
                        <div className="bg-black rounded-full p-[2px]">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" className="w-32 h-32 rounded-full object-cover" alt="User B" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center space-y-3 mb-12 z-10 px-6">
                <h2 className="text-2xl text-[#eaddcf] font-serif italic">Ambition Meets Generosity</h2>
                <p className="text-white/60 text-sm font-light tracking-wide max-w-xs mx-auto">You and <span className="text-primary font-medium">Elena</span> have sparked a connection worthy of attention.</p>
            </div>

            <div className="w-full max-w-xs space-y-4 z-10">
                <button
                    onClick={() => router.push('/gifts')}
                    className="w-full relative overflow-hidden rounded-lg bg-gradient-to-r from-[#f2cc0d] via-[#f9e47e] to-[#b09304] p-[1px]"
                >
                    <div className="relative flex items-center justify-center gap-3 bg-gradient-to-b from-primary to-[#d4b005] px-6 py-4 hover:brightness-110 transition-all">
                        <Icon name="card_giftcard" className="text-background-dark" />
                        <span className="font-bold text-background-dark text-sm tracking-wide uppercase">Send a Premium Gift</span>
                    </div>
                </button>
                <button
                    onClick={() => router.push('/chat')}
                    className="w-full rounded-lg border border-primary/40 bg-background-dark/50 px-6 py-4 hover:bg-primary/10 transition-all backdrop-blur-sm flex items-center justify-center gap-3"
                >
                    <Icon name="chat_bubble_outline" className="text-primary text-sm" />
                    <span className="font-medium text-primary tracking-wide text-sm uppercase">Start a Private Chat</span>
                </button>
            </div>
        </div>
    )
}
