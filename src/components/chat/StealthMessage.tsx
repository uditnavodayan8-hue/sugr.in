'use client';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StealthMessageProps {
    content: string;
    sender: string;
    isMe: boolean;
    timestamp: string;
}

export default function StealthMessage({ content, sender, isMe, timestamp }: StealthMessageProps) {
    return (
        <div className={cn("flex flex-col max-w-[70%]", isMe ? "items-end" : "items-start")}>
            <div className="text-[9px] text-zinc-600 mb-1 px-2 flex items-center gap-1">
                <span>{timestamp}</span>
                {isMe && <Lock size={8} className="text-zinc-600" />}
            </div>

            <div
                className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm",
                    isMe ? "bg-[#F7E7CE] text-black rounded-br-sm" : "bg-zinc-900 text-zinc-200 rounded-bl-sm border border-zinc-800"
                )}
            >
                {content}
            </div>
        </div>
    );
}
