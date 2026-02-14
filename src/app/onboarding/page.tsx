"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function OnboardingPage() {
    const router = useRouter();

    return (
        <div className="relative h-screen w-full bg-background-dark">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                    alt="Couple"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90"></div>
            </div>

            <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-12">
                <div className="absolute top-12 left-0 right-0 flex justify-center opacity-90">
                    <div className="text-primary font-serif italic text-2xl tracking-widest font-bold">Sugr</div>
                </div>

                <div className="glass-panel rounded-2xl p-8 border border-white/10 animate-fade-in-up">
                    <h1 className="font-serif text-4xl leading-tight text-white drop-shadow-sm mb-4">
                        Meet people who <span className="italic text-primary">invest</span> in your lifestyle
                    </h1>
                    <p className="font-sans text-white/80 text-lg font-light leading-relaxed mb-6">
                        Join an exclusive community where ambition meets romance. Experience dating without compromise.
                    </p>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex space-x-2">
                            <div className="w-8 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(242,204,13,0.5)]"></div>
                            <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                        </div>
                        <button
                            onClick={() => router.push('/setup')}
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-black hover:bg-white transition-colors shadow-[0_4px_14px_rgba(242,204,13,0.4)]"
                        >
                            <Icon name="arrow_forward" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
