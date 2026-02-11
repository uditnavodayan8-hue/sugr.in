import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface TripPost {
    id: string;
    userId: string;
    userName: string;
    userAge: number;
    userImage: string;
    verified: boolean;
    location: string;
    duration: string;
    startDate: string;
    allowance: string;
    description: string;
    postedAgo: string;
    role: 'provider' | 'protege';
}

export function TripsFeed() {
    const [trips, setTrips] = useState<TripPost[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = getSupabaseClient();

    useEffect(() => {
        const fetchTrips = async () => {
            const { data, error } = await supabase
                .from('trips')
                .select(`
                    *,
                    profiles:user_id (
                        name,
                        age,
                        avatar_url,
                        role,
                        verification_level
                    )
                `)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching trips:', error);
                setLoading(false);
                return;
            }

            const mappedTrips: TripPost[] = (data || []).map((t: any) => ({
                id: t.id,
                userId: t.user_id,
                userName: t.profiles?.name || 'Anonymous',
                userAge: t.profiles?.age || 20,
                userImage: t.profiles?.avatar_url || 'https://via.placeholder.com/150',
                verified: t.profiles?.verification_level?.id || false,
                location: t.destination,
                duration: `${Math.ceil((new Date(t.end_date).getTime() - new Date(t.start_date).getTime()) / (1000 * 60 * 60 * 24))} days`,
                startDate: new Date(t.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                allowance: t.allowance_offer || 'TBD',
                description: t.description,
                postedAgo: 'Recently',
                role: t.profiles?.role || 'protege'
            }));

            setTrips(mappedTrips);
            setLoading(false);
        };

        fetchTrips();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                <p className="text-white/40 text-sm italic">Sourcing elite escapes...</p>
            </div>
        );
    }

    if (trips.length === 0) {
        return (
            <div className="text-center py-20 px-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/10">
                    <Calendar className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Quiet on the Horizon</h3>
                <p className="text-white/40 text-sm">Be the first to propose a luxury getaway.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {trips.map((trip, index) => (
                    <motion.div
                        key={trip.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl overflow-hidden 
                       border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all duration-500
                       cursor-pointer group relative"
                    >
                        <div className="flex gap-5 p-5">
                            {/* User Image */}
                            <div className="relative flex-shrink-0">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-all duration-500">
                                    <img
                                        src={trip.userImage}
                                        alt={trip.userName}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                {trip.verified && (
                                    <div className="absolute -top-2 -right-2 bg-[#D4AF37] rounded-full p-1.5 shadow-lg">
                                        <CheckCircle className="w-3.5 h-3.5 text-black" fill="currentColor" />
                                    </div>
                                )}
                            </div>

                            {/* Trip Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-white font-medium text-xl leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                            {trip.userName}, {trip.userAge}
                                        </h3>
                                        <p className="text-[#D4AF37]/60 text-[10px] uppercase tracking-[0.2em] mt-1">{trip.role}</p>
                                    </div>
                                    <div className="text-white/20 text-[10px] uppercase tracking-wider">{trip.postedAgo}</div>
                                </div>

                                {/* Location and Duration */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="flex items-center gap-1.5 bg-[#D4AF37]/5 px-3 py-1.5 rounded-full border border-[#D4AF37]/10">
                                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                                        <span className="text-white/80 text-[11px] font-medium">{trip.location}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                        <Calendar className="w-3 h-3 text-white/40" />
                                        <span className="text-white/60 text-[11px]">{trip.startDate}</span>
                                    </div>
                                </div>

                                {/* Allowance */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-white/40 text-xs italic">Offering:</span>
                                    <span className="text-[#D4AF37] font-medium text-sm tracking-wide">
                                        {trip.allowance}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-white/50 text-xs leading-relaxed line-clamp-2 italic">
                                    "{trip.description}"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
