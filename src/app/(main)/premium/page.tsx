"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function PremiumPage() {
    const router = useRouter();

    return (
        <div className="h-screen w-full bg-background-dark relative flex flex-col overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"></div>

            <header className="relative z-10 w-full px-6 pt-12 pb-4 flex justify-between items-center">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
                    <Icon name="close" className="text-white/70" />
                </button>
                <div className="text-center">
                    <span className="font-serif italic text-primary text-xl font-bold tracking-wider">Sugr</span>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50">Premium</span>
                </div>
                <button className="text-sm font-medium text-white/70 hover:text-primary">Restore</button>
            </header>

            <main className="relative z-10 flex-1 flex flex-col px-6 overflow-y-auto pb-32">
                <div className="text-center space-y-2 py-6">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-1 mb-2 border border-primary/20">
                        <Icon name="workspace_premium" className="text-primary text-sm" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">Elite Access</span>
                    </div>
                    <h1 className="font-serif text-4xl text-white leading-tight">Unlock Your <br /><span className="italic font-light text-primary/90">Privilege</span></h1>
                </div>

                <div className="space-y-6 mt-4">
                    {/* Diamond Tier */}
                    <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-primary via-white to-primary shadow-[0_0_30px_rgba(242,204,13,0.15)] transform scale-[1.02]">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-[#FFE55C] px-4 py-1 rounded-full shadow-lg">
                            <span className="text-[10px] font-bold text-black uppercase tracking-widest">Most Popular</span>
                        </div>
                        <div className="bg-background-dark rounded-2xl p-6 h-full">
                            <div className="flex justify-between items-start mb-6 mt-2">
                                <div>
                                    <h3 className="font-serif text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-white italic font-medium">Diamond</h3>
                                    <p className="text-xs text-primary/80 uppercase tracking-widest mt-1">Ultimate Luxury</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-primary">$149.99</span>
                                    <span className="text-xs text-primary/60">/mo</span>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { icon: "diamond", text: "Concierge Service" },
                                    { icon: "visibility_off", text: "Hidden Mode" },
                                    { icon: "filter_list", text: "Exclusive Filters" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center space-x-3">
                                        <div className="bg-primary/20 rounded-full p-1"><Icon name={item.icon} className="text-primary text-sm" /></div>
                                        <span className="text-sm font-medium text-white">{item.text}</span>
                                    </li>
                                ))}
                                <li className="flex items-center space-x-3 opacity-80 pt-2 border-t border-white/5">
                                    <Icon name="add" className="text-primary/70" />
                                    <span className="text-xs text-white/60">Includes all Platinum benefits</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Platinum Tier */}
                    <div className="glass-panel rounded-2xl p-5 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-serif text-2xl text-white/90">Platinum</h3>
                                <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Priority</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-white">$79.99</span>
                                <span className="text-xs text-white/40">/mo</span>
                            </div>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <Icon name="check_circle" className="text-primary" />
                                <span className="text-sm text-white/80">See who likes you</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 w-full z-30 bg-gradient-to-t from-background-dark via-background-dark to-transparent pt-12 pb-8 px-6">
                <button className="w-full relative overflow-hidden rounded-xl bg-primary py-4 px-6 active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(242,204,13,0.3)]">
                    <span className="relative z-20 flex items-center justify-center space-x-2 text-black font-bold tracking-wide text-lg">
                        <span>Upgrade to Elite</span>
                        <Icon name="arrow_forward" size={20} />
                    </span>
                </button>
            </div>
        </div>
    );
}
