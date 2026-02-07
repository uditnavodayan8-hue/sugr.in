'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getActiveAds, Ad } from '@/lib/services/ads';
import AdCard from './AdCard';
import { Loader2, Radio } from 'lucide-react';
import { toast } from 'sonner';

export default function BroadcastFeed() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAds();
    }, []);

    const loadAds = async () => {
        try {
            const data = await getActiveAds();
            setAds(data);
        } catch (error) {
            console.error(error);
            toast.error('Signal lost. Retrying...');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-[#F7E7CE]">
                <Loader2 className="w-6 h-6 animate-spin mb-4" />
                <span className="text-xs uppercase tracking-widest opacity-50">Tuning Frequency...</span>
            </div>
        );
    }

    if (ads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-white/30 px-8 text-center">
                <Radio className="w-12 h-12 mb-6 opacity-20" strokeWidth={1} />
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Silence on the airwaves</h3>
                <p className="text-sm font-light max-w-xs">
                    No active broadcasts in your sector. Be the first to transmit?
                </p>
                <button className="mt-8 px-6 py-3 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors">
                    Initialize Broadcast
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/5 pb-32">
            {ads.map((ad) => (
                <AdCard
                    key={ad.id}
                    ad={ad}
                    onClick={() => toast("Request Access implementation pending (Pillar 3)")}
                />
            ))}
        </div>
    );
}
