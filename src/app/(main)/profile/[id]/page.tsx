"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function ProfileDetailPage() {
    const router = useRouter();

    return (
        <div className="max-w-md mx-auto relative min-h-screen bg-background-dark overflow-hidden">
            <nav className="absolute top-0 w-full z-20 flex justify-between items-center p-6 pt-12 bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/40 transition-colors">
                    <Icon name="arrow_back" />
                </button>
                <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/40 transition-colors">
                    <Icon name="more_horiz" />
                </button>
            </nav>

            <div className="relative h-[75vh] w-full">
                <img src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Profile" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background-dark to-transparent z-10 flex flex-col justify-end p-6 pb-12">
                    <div className="self-start mb-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/60 bg-primary/10 backdrop-blur-sm">
                            <Icon name="verified" className="text-primary text-xs" />
                            <span className="text-primary text-xs font-bold uppercase tracking-wider">Muse</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-1 font-serif">Anastasia, 24</h1>
                    <div className="flex items-center text-gray-300 text-sm font-medium">
                        <Icon name="location_on" className="text-base mr-1" /> Mumbai <span className="mx-2">•</span> 2km away
                    </div>
                </div>
            </div>

            <div className="relative z-10 -mt-8 bg-background-dark rounded-t-[2rem] px-6 pt-8 pb-32 space-y-8 border-t border-white/5">
                <div className="text-center px-4">
                    <p className="text-lg italic text-gray-400 font-light leading-relaxed">"Seeking a companion for Art Basel, the Monaco GP, and quiet weekends."</p>
                </div>

                <div className="bg-surface-dark border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Icon name="security" /></div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Gold Verified</h3>
                            <p className="text-xs text-gray-400">Identity Confirmed</p>
                        </div>
                    </div>
                    <Icon name="check_circle" className="text-primary" />
                </div>

                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 ml-1">Interests</h2>
                    <div className="flex flex-wrap gap-2">
                        {["Fine Dining", "Travel", "Art", "Fashion"].map(t => (
                            <span key={t} className="px-4 py-2 rounded-lg bg-surface-dark border border-white/5 text-sm text-gray-300">{t}</span>
                        ))}
                    </div>
                </div>

                <div className="h-12"></div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark border-t border-white/5 flex gap-4 z-50">
                <button className="flex-1 h-14 rounded-xl bg-surface-dark border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all">
                    <Icon name="favorite_border" className="text-gray-400" />
                    <span className="font-medium text-sm">Interest</span>
                </button>
                <button onClick={() => router.push('/gifts')} className="flex-[2] h-14 rounded-xl bg-gradient-to-r from-primary to-[#b59a0b] text-background-dark font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(242,204,13,0.4)] active:scale-95 transition-all">
                    <Icon name="card_giftcard" />
                    <span>Send Gift</span>
                </button>
            </div>
        </div>
    )
}
