'use client';
import { cn } from '@/lib/utils';

interface OnlineStatusProps {
    status: 'online' | 'offline' | 'away';
    lastSeen?: Date | null;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function OnlineStatus({ status, lastSeen, showText = false, size = 'md' }: OnlineStatusProps) {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
    };

    const statusColors = {
        online: 'bg-green-500',
        away: 'bg-yellow-500',
        offline: 'bg-zinc-500',
    };

    const getLastSeenText = () => {
        if (status === 'online') return 'Online now';
        if (!lastSeen) return 'Offline';

        const diff = Date.now() - lastSeen.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="flex items-center gap-1.5">
            <div
                className={cn(
                    sizeClasses[size],
                    statusColors[status],
                    'rounded-full border-2 border-black',
                    status === 'online' && 'animate-pulse'
                )}
            />
            {showText && (
                <span className="text-[10px] text-white/50 uppercase tracking-wide">
                    {getLastSeenText()}
                </span>
            )}
        </div>
    );
}
