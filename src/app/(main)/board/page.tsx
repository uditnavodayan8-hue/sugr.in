"use client";

import React from 'react';
import { Icon } from '@/components/ui/Icon';

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
            <img src={img} className="w-14 h-14 rounded-full object-cover border-2 border-primary/50" alt={title} />
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

export default function BoardPage() {
    return (
        <div className="min-h-screen w-full bg-background-dark flex flex-col">
            <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5 pt-12 pb-4 px-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gold-text">The Board</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Exclusive Opportunities</p>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-primary object-cover" alt="Profile" />
                        <div className="absolute -bottom-1 -right-1 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black">9+</div>
                    </div>
                </div>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-dark border border-white/10 rounded-full text-xs font-medium text-white whitespace-nowrap"><Icon name="tune" className="text-base text-primary" /> Filters</button>
                    <button className="px-4 py-2 bg-primary text-black rounded-full text-xs font-bold shadow-[0_0_10px_rgba(242,204,13,0.3)] whitespace-nowrap">Near Me</button>
                    <button className="px-4 py-2 bg-surface-dark border border-white/10 rounded-full text-xs font-medium text-gray-400 whitespace-nowrap">Travel</button>
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
            <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-[0_0_15px_rgba(242,204,13,0.4)] flex items-center justify-center z-40 hover:scale-105 transition-transform">
                <Icon name="add" className="text-2xl" />
            </button>
        </div>
    )
}
