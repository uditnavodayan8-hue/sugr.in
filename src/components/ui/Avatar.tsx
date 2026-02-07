'use client';
import { cn } from "@/lib/utils";
import OnlineStatus from "./OnlineStatus";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showOnlineStatus?: boolean;
    onlineStatus?: 'online' | 'offline' | 'away';
}

export function Avatar({
    src,
    alt = "Avatar",
    size = 'md',
    className,
    showOnlineStatus = false,
    onlineStatus = 'offline',
}: AvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
        xl: 'w-16 h-16',
    };

    return (
        <div className={cn("relative inline-block", className)}>
            <img
                src={src || "https://via.placeholder.com/150"}
                alt={alt}
                className={cn(
                    "rounded-full object-cover ring-1 ring-white/10",
                    sizeClasses[size]
                )}
            />
            {showOnlineStatus && (
                <div className="absolute bottom-0 right-0">
                    <OnlineStatus
                        status={onlineStatus}
                        size={size === 'sm' ? 'sm' : 'md'}
                    />
                </div>
            )}
        </div>
    );
}
