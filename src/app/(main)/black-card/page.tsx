"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function BlackCardPage() {
    const router = useRouter();

    return (
        <div className="h-screen w-full bg-[#1a1a1a] relative flex flex-col overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-transparent to-[#1a1a1a]"></div>

            <header className="flex justify-between items-center px-6 pt-12 pb-4 z-10">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors">
                    <Icon name="close" />
                </button>
                <div className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                    <span className="text-primary text-xs font-bold tracking-wider uppercase">Elite Mode</span>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 flex flex-col items-center z-10">
                <div className="text-center mb-8 mt-4">
                    <h1 className="text-2xl font-bold text-white mb-2">Unlock Legendary Status</h1>
                    <p className="text-white/50 text-sm font-medium">Verification required for Black Card access</p>
                </div>

                <div className="w-full aspect-[1.586/1] mb-12 relative group perspective-1000">
                    <div className="relative w-full h-full rounded-2xl bg-black shadow-2xl border border-white/5 overflow-hidden transform transition-transform hover:scale-[1.02]">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-9 rounded bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 relative border border-yellow-600/50"></div>
                                <Icon name="wifi" className="text-white/20 rotate-90" size={24} />
                            </div>
                            <div className="space-y-1">
                                <div className="text-transparent bg-clip-text bg-gold-gradient font-display font-extrabold text-2xl tracking-widest uppercase">
                                    Sugr <span className="font-light text-primary/80">Elite</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="font-mono text-white/40 text-xs tracking-[0.2em] pt-2">•••• •••• •••• 9021</div>
                                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Member Since 2024</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full space-y-4 mb-8">
                    {[
                        { icon: "flight_takeoff", title: "Global Priority", desc: "Profile seen first worldwide" },
                        { icon: "concierge", title: "Private Concierge", desc: "24/7 dedicated support" },
                        { icon: "stars", title: "VVIP Event Access", desc: "Guaranteed invitations to galas" },
                    ].map((perk, i) => (
                        <div key={i} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Icon name={perk.icon} className="text-primary text-xl" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">{perk.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{perk.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-gradient-to-t from-background-dark to-transparent z-20">
                <button className="w-full py-4 rounded-lg bg-gradient-to-r from-[#f2cc0d] to-[#b3960a] text-black font-extrabold text-lg uppercase tracking-wide shadow-[0_0_20px_rgba(242,204,13,0.4)] flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <Icon name="verified" size={24} />
                    <span>Apply for Verification</span>
                </button>
            </div>
        </div>
    )
}
