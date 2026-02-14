"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function VaultPage() {
    const router = useRouter();

    return (
        <div className="h-screen w-full bg-[#0A0A0A] flex flex-col">
            <header className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-gray-800">
                <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full text-gray-400 hover:text-white transition-colors"><Icon name="chevron_left" /></button>
                <h1 className="text-lg font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary">The Vault</h1>
                <button className="p-2 -mr-2 rounded-full text-gray-400 hover:text-white transition-colors"><Icon name="help_outline" /></button>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 border border-gray-700 shadow-[0_0_20px_rgba(115,17,212,0.4)] mb-2">
                        <Icon name="security" className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Privacy Command</h2>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-primary rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-[#141414] border border-gray-800 p-6 rounded-2xl shadow-2xl">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Icon name="visibility_off" className="text-primary text-3xl" />
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-wide">Stealth Mode</h3>
                                        <p className="text-xs text-primary uppercase tracking-widest font-semibold">Global Override</p>
                                    </div>
                                </div>
                                <div className="w-14 h-8 bg-primary rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 bg-white w-6 h-6 rounded-full shadow-lg flex items-center justify-center">
                                        <Icon name="lock" className="text-[14px] text-black" />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-4 mt-2">
                                <p className="text-sm text-gray-300"><span className="text-primary font-semibold">Active.</span> You are invisible to non-matches.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#141414] border border-gray-800 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-3">
                            <div className="p-2 bg-gray-800 rounded-lg text-primary"><Icon name="face_retouching_natural" /></div>
                            <div>
                                <h4 className="font-bold text-white">Smart Face Blur</h4>
                                <p className="text-xs text-gray-400 mt-1">Obscure identity until matched.</p>
                            </div>
                        </div>
                        <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div></div>
                    </div>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-black mb-6 border border-white/10">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Face Blur Demo" />
                        <div className="absolute inset-0 backdrop-blur-[8px] flex items-center justify-center">
                            <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                <Icon name="visibility" className="text-white text-sm" />
                                <span className="text-xs text-white font-medium">Public View</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
