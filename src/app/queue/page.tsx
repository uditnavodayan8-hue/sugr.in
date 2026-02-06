'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Check, X, Lock, BadgeCheck, MapPin, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const MOCK_APPLICANTS = [
    { id: 1, name: "Priya", age: 24, city: "Mumbai", role: "Protégé", verified: true, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop", expiresIn: "47h 12m", message: "Your profile caught my attention..." },
    { id: 2, name: "Arjun", age: 38, city: "Bangalore", role: "Provider", verified: true, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop", expiresIn: "23h 45m", message: "Looking for someone special..." },
    { id: 3, name: "Meera", age: 26, city: "Delhi NCR", role: "Protégé", verified: false, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop", expiresIn: "12h 30m", message: "Hi! Let's connect." },
];

export default function VettingQueue() {
    const router = useRouter();
    const [applicants, setApplicants] = useState(MOCK_APPLICANTS);

    const handleAccept = (id: number) => {
        setApplicants(prev => prev.filter(a => a.id !== id));
        // In production: Create match, open chat
    };

    const handleDecline = (id: number) => {
        setApplicants(prev => prev.filter(a => a.id !== id));
        // In production: Ghost the user
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white pb-24">
            <header className="p-6 border-b border-zinc-900 flex justify-between items-center bg-[#050505]/95 backdrop-blur-md sticky top-0 z-50">
                <button onClick={() => router.back()} className="text-zinc-400 hover:text-white"><ArrowLeft size={20} /></button>
                <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-300">Vetting Queue</h1>
                <div className="w-5" />
            </header>

            <div className="p-4 space-y-4">
                {applicants.length === 0 ? (
                    <div className="text-center py-20 text-zinc-600">
                        <Lock size={32} className="mx-auto mb-4 opacity-50" />
                        <p className="text-sm">No pending applications</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {applicants.map((applicant, i) => (
                            <motion.div
                                key={applicant.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden"
                            >
                                {/* Expiry Badge */}
                                <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] uppercase tracking-wider bg-black/50 px-2 py-1 rounded-full text-orange-400">
                                    <Clock size={10} /> {applicant.expiresIn}
                                </div>

                                <div className="flex gap-4">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <img src={applicant.avatar} className="w-20 h-20 rounded-xl object-cover border border-zinc-700" />
                                        {applicant.verified && (
                                            <div className="absolute -bottom-1 -right-1 p-1 bg-[#F7E7CE] rounded-full">
                                                <BadgeCheck size={12} className="text-black" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-serif">{applicant.name}, {applicant.age}</h3>
                                            <span className={cn("text-[9px] uppercase px-2 py-0.5 rounded-full", applicant.role === 'Provider' ? "bg-blue-900/50 text-blue-300" : "bg-pink-900/50 text-pink-300")}>
                                                {applicant.role}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                                            <MapPin size={10} /> {applicant.city}
                                        </div>
                                        <p className="text-xs text-zinc-400 italic line-clamp-1">"{applicant.message}"</p>

                                        {/* Double-Opt-In Lock */}
                                        <div className="flex items-center gap-2 text-[9px] text-zinc-600 mt-2">
                                            <Lock size={10} /> <span>Full Dossier locked until mutual consent</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => handleDecline(applicant.id)}
                                        className="flex-1 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs uppercase tracking-widest text-zinc-400 hover:bg-red-900/30 hover:text-red-400 hover:border-red-800 transition-all flex items-center justify-center gap-2"
                                    >
                                        <X size={14} /> Decline
                                    </button>
                                    <button
                                        onClick={() => handleAccept(applicant.id)}
                                        className="flex-1 py-3 bg-[#F7E7CE] rounded-xl text-xs uppercase tracking-widest text-black font-bold hover:bg-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check size={14} /> Accept
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </main>
    );
}
