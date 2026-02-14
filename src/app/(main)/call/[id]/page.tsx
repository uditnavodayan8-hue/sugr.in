"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function VideoCallPage() {
    const router = useRouter();
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
            <img src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Remote Video" />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

            {/* Header */}
            <div className="absolute top-0 w-full pt-12 px-6 flex justify-between items-start z-10">
                <button onClick={() => router.back()} className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10"><Icon name="keyboard_arrow_down" /></button>
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
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Self Video" />
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
                    onClick={() => router.back()}
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
