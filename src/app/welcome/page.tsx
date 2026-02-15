'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/gatekeeper/AuthModal';

export default function WelcomePage() {
    const [showAuth, setShowAuth] = useState(false);
    const [initialMode, setInitialMode] = useState<'signin' | 'signup'>('signup');

    const handleJoin = () => {
        setInitialMode('signup');
        setShowAuth(true);
    };

    const handleLogin = () => {
        setInitialMode('signin');
        setShowAuth(true);
    };

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center bg-background-dark">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>

            <div className="z-10 flex flex-col items-center animate-fade-in-up mb-20">
                {/* Logo SVG Simulation */}
                <div className="relative mb-6">
                    <svg className="drop-shadow-2xl" fill="none" height="100" viewBox="0 0 120 120" width="100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M78.5 32C74.5 28.5 68.5 26.5 60 26.5C44 26.5 34 35.5 34 49.5C34 61.5 42.5 67 52.5 70.5L58 72.5C65.5 75 69 77.5 69 83C69 88.5 64 92 57.5 92C49 92 42 87.5 38.5 82" stroke="url(#paint0_linear)" strokeLinecap="round" strokeWidth="6"></path>
                        <path d="M42 93C46.5 96 52 97.5 58 97.5C76 97.5 86 88 86 72.5C86 60 76.5 54.5 67 51L62 49C54 46.5 51 44.5 51 38.5C51 33.5 55 30.5 60.5 30.5C66.5 30.5 72 33.5 75 37" stroke="url(#paint1_linear)" strokeLinecap="round" strokeWidth="6"></path>
                        <defs>
                            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="34" x2="80" y1="26.5" y2="92">
                                <stop offset="0%" stopColor="#f2cc0d"></stop>
                                <stop offset="100%" stopColor="#bf9b30"></stop>
                            </linearGradient>
                            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear" x1="40" x2="86" y1="30" y2="97.5">
                                <stop offset="0%" stopColor="#bf9b30"></stop>
                                <stop offset="100%" stopColor="#f2cc0d"></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <h1 className="text-4xl tracking-[0.2em] font-serif font-medium text-transparent bg-clip-text bg-gold-text">SUGR</h1>

                <div className="mt-8 flex flex-col items-center space-y-6">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                    <p className="text-gold-light/90 font-serif text-lg tracking-wide italic font-light text-center max-w-xs leading-relaxed">
                        Where Ambition<br />Meets Generosity
                    </p>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                </div>
            </div>

            <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center space-y-4 px-8 z-20">
                <button
                    onClick={handleJoin}
                    className="w-full max-w-xs bg-primary text-black font-bold py-3.5 rounded-full text-center shadow-[0_0_20px_rgba(242,204,13,0.3)] hover:bg-white hover:scale-[1.02] transition-all duration-300 uppercase tracking-wide text-xs"
                >
                    Join Now
                </button>
                <div className="flex items-center space-x-2 text-sm text-white/60 font-medium">
                    <span>Already have an account?</span>
                    <button onClick={handleLogin} className="text-primary hover:text-white transition-colors">Log In</button>
                </div>
            </div>

            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                initialMode={initialMode}
            />
        </div>
    );
}
