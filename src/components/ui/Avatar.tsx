'use client';
import { cn } from "@/lib/utils";
import { usePresence } from "@/hooks/usePresence";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    userId?: string; // If provided, checks online status
    size?: number;
    className?: string;
    isOnlineFallback?: boolean; // For manual override
}

export function Avatar({
    src,
    alt = "Avatar",
    userId,
    size = 10, // w-10 equivalent
    className,
    isOnlineFallback
}: AvatarProps) {
    const { isUserOnline } = usePresence();
    const isOnline = userId ? isUserOnline(userId) : isOnlineFallback;

    // Map size number to tailwind classes roughly
    const sizeClass = size === 10 ? "w-10 h-10" :
        size === 14 ? "w-14 h-14" :
            size === 16 ? "w-16 h-16" :
                "w-10 h-10";

    return (
        <div className={cn("relative inline-block", className)}>
            <img
                src={src || "https://via.placeholder.com/150"}
                alt={alt}
                className={cn(
                    "rounded-full object-cover ring-1 ring-white/10",
                    sizeClass
                )}
            />
            {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A0A0A] rounded-full z-10" />
            )}
        </div>
    );
}
