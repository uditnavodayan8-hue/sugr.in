'use client';
import { TrendingUp, Menu, Search, User } from 'lucide-react';
import { useState, useRef } from 'react';
import { usePanic } from '@/context/PanicContext';

export default function NewsFacade() {
    const { togglePanic } = usePanic();
    const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

    // Secret Exit: Long press on the "MARKET WATCH" header
    const handleMouseDown = () => {
        const timer = setTimeout(() => {
            // Confirmation dialog or just instant switch back?
            // For safety, maybe just switch back
            togglePanic();
        }, 3000); // 3 seconds hold to exit panic mode
        setLongPressTimer(timer);
    };

    const handleMouseUp = () => {
        if (longPressTimer) clearTimeout(longPressTimer);
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Boring Header */}
            <header className="bg-[#003366] text-white p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <Menu size={24} />
                    <h1
                        className="text-lg font-bold tracking-tight select-none cursor-default"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                    >
                        MARKET WATCH
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <Search size={20} />
                    <User size={20} />
                </div>
            </header>

            {/* Boring Ticker */}
            <div className="bg-gray-100 p-2 flex gap-6 overflow-x-auto text-xs font-mono border-b border-gray-200">
                <span className="text-green-600 flex items-center gap-1">NSE:NIFTY <TrendingUp size={10} /> 22,450.30 (+0.5%)</span>
                <span className="text-red-600 flex items-center gap-1">BSE:SENSEX ▼ 73,980.15 (-0.1%)</span>
                <span className="text-green-600 flex items-center gap-1">USD/INR <TrendingUp size={10} /> 83.12 (+0.02%)</span>
                <span className="text-gray-600">GOLD 65,400.00</span>
            </div>

            {/* Boring News List */}
            <div className="p-4 space-y-4">
                <div className="space-y-1">
                    <h2 className="font-bold text-lg leading-tight text-gray-800">Global Markets Rally as Inflation Data Meets Expectations</h2>
                    <p className="text-xs text-gray-500 uppercase">2 hours ago • Economy</p>
                </div>
                <hr />
                <div className="space-y-1">
                    <h2 className="font-bold text-lg leading-tight text-gray-800">Tech Sector Sees Correction Amidst Regulatory Concerns in EU</h2>
                    <p className="text-xs text-gray-500 uppercase">4 hours ago • Technology</p>
                </div>
                <hr />
                <div className="space-y-1">
                    <h2 className="font-bold text-lg leading-tight text-gray-800">Infrastructure Spending to Boost Domestic Steel Demand in Q3</h2>
                    <p className="text-xs text-gray-500 uppercase">6 hours ago • Commodities</p>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-2">Editor's Pick</h3>
                    <p className="text-sm text-blue-800">Understanding the impact of fiscal policy on long-term bond yields.</p>
                </div>
            </div>
        </div>
    );
}
