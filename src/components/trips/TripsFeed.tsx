import { MapPin, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TripPost {
    id: string; // Changed to string for UUID
    userId: string; // Changed to string for UUID
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
    role: 'sugar-baby' | 'sugar-daddy' | 'provider' | 'protege';
}

interface TripsFeedProps {
    trips: TripPost[];
    onTripClick: (trip: TripPost) => void;
}

export function TripsFeed({ trips, onTripClick }: TripsFeedProps) {
    return (
        <div className="space-y-4">
            {trips.map((trip, index) => (
                <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onTripClick(trip)}
                    className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-2xl overflow-hidden 
                   border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300
                   cursor-pointer group shadow-lg hover:shadow-2xl"
                >
                    <div className="flex gap-4 p-4">
                        {/* User Image */}
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#D4AF37]/30 group-hover:border-[#D4AF37]/50 transition-all">
                                <img
                                    src={trip.userImage}
                                    alt={trip.userName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {trip.verified && (
                                <div className="absolute -top-1 -right-1 bg-[#D4AF37] rounded-full p-1">
                                    <CheckCircle className="w-3 h-3 text-black" fill="currentColor" />
                                </div>
                            )}
                        </div>

                        {/* Trip Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-white font-semibold text-base">
                                        {trip.userName}, {trip.userAge}
                                    </h3>
                                    <p className="text-white/50 text-xs mt-0.5">{trip.postedAgo}</p>
                                </div>
                                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${trip.role === 'sugar-baby' || trip.role === 'protege'
                                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    }`}>
                                    {trip.role === 'sugar-baby' || trip.role === 'protege' ? 'Sugar Baby' : 'Sugar Daddy'}
                                </div>
                            </div>

                            {/* Location and Duration */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-lg">
                                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                                    <span className="text-white text-xs font-medium">{trip.location}</span>
                                </div>

                                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-lg">
                                    <Calendar className="w-3.5 h-3.5 text-white/60" />
                                    <span className="text-white/80 text-xs">{trip.startDate}</span>
                                </div>

                                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-lg">
                                    <Clock className="w-3.5 h-3.5 text-white/60" />
                                    <span className="text-white/80 text-xs">{trip.duration}</span>
                                </div>
                            </div>

                            {/* Allowance */}
                            <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent px-3 py-2 rounded-lg border border-[#D4AF37]/20">
                                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-[#D4AF37] font-semibold text-sm">
                                    {trip.allowance} allowance
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-white/70 text-sm line-clamp-2">
                                {trip.description}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
