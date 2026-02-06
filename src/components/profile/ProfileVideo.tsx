'use client';
import { useRef, useState } from 'react';
import { Play, Pause, BadgeCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileVideoProps {
    avatarUrl?: string | null;
    videoUrl?: string | null;
}

export default function ProfileVideo({ avatarUrl, videoUrl }: ProfileVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // If no video, show avatar or placeholder
    if (!videoUrl) {
        return (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User size={32} className="text-zinc-600" />
                )}
            </div>
        );
    }

    return (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-700 group cursor-pointer" onClick={togglePlay}>
            {/* Profile Video */}
            <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
            />

            {/* Verification Watermark */}
            <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur-md rounded-full p-1 border border-[#F7E7CE]/30">
                <BadgeCheck size={10} className="text-[#F7E7CE]" />
            </div>

            {/* Play/Pause Overlay */}
            <div className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200",
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            )}>
                {isPlaying ? <Pause size={16} className="text-white drop-shadow-md" /> : <Play size={16} className="text-white drop-shadow-md" />}
            </div>

            {/* Vibe Check Label */}
            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] uppercase tracking-widest text-zinc-300 font-bold border border-white/10">
                Vibe Check
            </div>
        </div>
    );
}
