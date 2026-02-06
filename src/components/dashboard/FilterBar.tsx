'use client';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FilterBar() {
    const filters = ["All", "Mumbai", "Delhi", "Provider", "Protégé", "Verified"];

    return (
        <div className="sticky top-0 z-50 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-900/50">
            <div className="flex items-center gap-3 overflow-x-auto px-6 no-scrollbar">
                <button className="p-2 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400">
                    <SlidersHorizontal size={16} />
                </button>
                {filters.map((filter) => (
                    <button
                        key={filter}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                            filter === 'All'
                                ? "bg-[#F7E7CE] text-black border-[#F7E7CE]"
                                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-[#F7E7CE]/50 hover:text-white"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    );
}
