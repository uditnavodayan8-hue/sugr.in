'use client';

import { Skeleton } from "@/components/ui/Skeleton";

export function ProfileCardSkeleton() {
    return (
        <div className="relative w-full h-full bg-[#0A0A0A] overflow-hidden">
            {/* Skeleton Image Layer */}
            <Skeleton className="absolute inset-0 w-full h-full bg-white/5" />

            {/* Top Badge Skeleton */}
            <div className="absolute top-8 left-8 z-20">
                <Skeleton className="h-8 w-24 rounded-full bg-white/10" />
            </div>

            {/* Bottom Content Skeleton */}
            <div className="absolute inset-x-0 bottom-0 z-30 px-8 pb-8 pt-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                <Skeleton className="h-8 w-2/3 mb-2 bg-white/10" />
                <Skeleton className="h-4 w-1/3 mb-8 bg-white/5" />

                <div className="flex items-center justify-center gap-6">
                    <Skeleton className="w-16 h-16 rounded-full bg-white/5" />
                    <Skeleton className="w-20 h-20 rounded-full bg-white/10" />
                    <Skeleton className="w-16 h-16 rounded-full bg-white/5" />
                </div>
            </div>
        </div>
    );
}
