"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function RoleSelectionPage() {
    const router = useRouter();

    return (
        <div className="h-screen w-full bg-background-dark flex flex-col relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

            <header className="flex items-center justify-between px-6 pt-12 pb-4 z-10">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-primary transition-colors">
                    <Icon name="arrow_back" />
                </button>
                <div className="text-xl font-bold tracking-widest text-primary uppercase">Sugr</div>
                <div className="w-6"></div>
            </header>

            <main className="flex-1 flex flex-col px-6 z-10">
                <div className="w-full flex justify-center space-x-2 mb-12 mt-4">
                    <div className="h-1 w-8 rounded-full bg-gray-700"></div>
                    <div className="h-1 w-8 rounded-full bg-gray-700"></div>
                    <div className="h-1 w-8 rounded-full bg-primary shadow-[0_0_10px_rgba(242,204,13,0.5)]"></div>
                </div>

                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-semibold text-white mb-3">Define your status</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Select your role to begin your exclusive journey.
                    </p>
                </div>

                <div className="flex flex-col gap-6 flex-1 pb-10">
                    <button
                        onClick={() => router.push('/discovery')}
                        className="group relative w-full text-left transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl blur-[1px] group-hover:from-primary group-hover:to-primary/50 transition duration-500 opacity-70 group-hover:opacity-100"></div>
                        <div className="relative bg-surface-dark rounded-xl p-6 h-32 flex items-center justify-between border border-gray-800 group-hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Icon name="diamond" className="text-gray-300 group-hover:text-primary text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">I am a Benefactor</h3>
                                    <p className="text-sm text-gray-400 mt-1">Generous & Established</p>
                                </div>
                            </div>
                            <div className="h-6 w-6 rounded-full border-2 border-gray-600 group-hover:border-primary flex items-center justify-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => router.push('/discovery')}
                        className="group relative w-full text-left transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl blur-[1px] group-hover:from-primary group-hover:to-primary/50 transition duration-500 opacity-70 group-hover:opacity-100"></div>
                        <div className="relative bg-surface-dark rounded-xl p-6 h-32 flex items-center justify-between border border-gray-800 group-hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Icon name="star" className="text-gray-300 group-hover:text-primary text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">I am a Companion</h3>
                                    <p className="text-sm text-gray-400 mt-1">Ambitious & Attractive</p>
                                </div>
                            </div>
                            <div className="h-6 w-6 rounded-full border-2 border-gray-600 group-hover:border-primary flex items-center justify-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mb-10 text-center opacity-60">
                    <p className="text-xs text-gray-400">By continuing, you agree to our Terms of Service.</p>
                </div>
            </main>
        </div>
    );
}
