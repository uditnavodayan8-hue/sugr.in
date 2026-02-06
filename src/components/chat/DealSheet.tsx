'use client';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Shield, X, PenTool, Clock, Plus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DealSheetProps {
    partnerName: string;
    onClose: () => void;
    onSeal: () => void;
}

export default function DealSheet({ partnerName, onClose, onSeal }: DealSheetProps) {
    const [allowance, setAllowance] = useState("₹1,00,000");
    const [frequency, setFrequency] = useState("Weekly");
    const [terms, setTerms] = useState<string[]>(["NDA Required"]);
    const [mySigned, setMySigned] = useState(false);
    const [partnerSigned, setPartnerSigned] = useState(false);

    const toggleTerm = (term: string) => {
        if (terms.includes(term)) setTerms(terms.filter(t => t !== term));
        else setTerms([...terms, term]);
    };

    const handleSign = () => {
        setMySigned(true);
        // Simulate partner signing after delay
        setTimeout(() => setPartnerSigned(true), 2000);
    };

    const canSeal = mySigned && partnerSigned;

    const OptionButton = ({ label, active, onClick, mono = false }: { label: string, active: boolean, onClick: () => void, mono?: boolean }) => (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-3 rounded-2xl text-[13px] font-medium transition-all border",
                active
                    ? "bg-[#F7E7CE] text-[#0A0A0A] border-[#F7E7CE]"
                    : "bg-white/[0.03] text-white/60 border-white/[0.05] hover:border-white/20"
            )}
        >
            {label}
        </button>
    );

    return (
        <div className="absolute inset-0 bg-[#0A0A0A] text-white z-50 flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-12 pb-6 border-b border-white/[0.06] flex justify-between items-center bg-[#0A0A0A]">
                <div>
                    <h2 className="text-[20px] font-bold tracking-tight">Protocol 01</h2>
                    <p className="text-[11px] text-[#F7E7CE] uppercase tracking-[0.2em] font-semibold mt-0.5">Confidential Arrangement</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
                    <X size={20} strokeWidth={1.5} />
                </button>
            </div>

            <div className="flex-1 px-6 py-6 space-y-8 overflow-y-auto no-scrollbar pb-32">
                {/* Financials */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#F7E7CE] rounded-full" />
                        <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em]">Expected Support</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {["₹50,000", "₹1,00,000", "₹2,50,000", "₹5,00,000+"].map(amt => (
                            <OptionButton key={amt} label={amt} active={allowance === amt} onClick={() => setAllowance(amt)} />
                        ))}
                    </div>
                </div>

                {/* Cadence */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#F7E7CE] rounded-full" />
                        <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em]">Interaction Model</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {["Weekly", "Bi-Weekly", "Monthly", "On-Call"].map(freq => (
                            <OptionButton key={freq} label={freq} active={frequency === freq} onClick={() => setFrequency(freq)} />
                        ))}
                    </div>
                </div>

                {/* Provisions */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#F7E7CE] rounded-full" />
                        <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em]">Special Provisions</h3>
                    </div>
                    <div className="space-y-2">
                        {["NDA Required", "Travel Included", "Exclusive", "Gifts Expected"].map(term => (
                            <button
                                key={term}
                                onClick={() => toggleTerm(term)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                                    terms.includes(term)
                                        ? "bg-white/[0.06] border-[#F7E7CE]/40"
                                        : "bg-white/[0.03] border-white/[0.05]"
                                )}
                            >
                                <span className={cn("text-[15px]", terms.includes(term) ? "text-white" : "text-white/50")}>{term}</span>
                                {terms.includes(term) && <CheckCircle size={16} className="text-[#F7E7CE]" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Signatures */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PenTool size={14} className="text-white/30" />
                            <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em]">Signatures</h3>
                        </div>
                        {partnerSigned && <span className="text-[10px] text-[#F7E7CE] font-bold uppercase tracking-widest animate-pulse">Fully Executed</span>}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {/* My Sig */}
                        <div className={cn(
                            "p-5 rounded-3xl border transition-all flex items-center justify-between",
                            mySigned ? "bg-[#F7E7CE]/10 border-[#F7E7CE]/20" : "bg-white/[0.03] border-white/[0.05]"
                        )}>
                            <div>
                                <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-1">Your Execution</p>
                                <p className={cn("text-[17px] font-semibold", mySigned ? "text-white" : "text-white/20")}>{mySigned ? "Digital ID: SEALED" : "Unsigned"}</p>
                            </div>
                            {!mySigned ? (
                                <button onClick={handleSign} className="px-6 py-3 bg-[#F7E7CE] text-[#0A0A0A] text-[13px] font-bold rounded-2xl active:scale-95 transition-all">Sign</button>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-[#F7E7CE]/20 flex items-center justify-center">
                                    <CheckCircle size={20} className="text-[#F7E7CE]" />
                                </div>
                            )}
                        </div>

                        {/* Partner Sig */}
                        <div className={cn(
                            "p-5 rounded-3xl border transition-all flex items-center justify-between",
                            partnerSigned ? "bg-[#F7E7CE]/10 border-[#F7E7CE]/20" : "bg-white/[0.03] border-white/[0.05]"
                        )}>
                            <div>
                                <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-1">{partnerName}'s Execution</p>
                                <p className={cn("text-[17px] font-semibold", partnerSigned ? "text-white" : "text-white/20")}>{partnerSigned ? "Digital ID: SEALED" : (mySigned ? "Awaiting..." : "Pending Signature")}</p>
                            </div>
                            {partnerSigned && (
                                <div className="w-10 h-10 rounded-full bg-[#F7E7CE]/20 flex items-center justify-center">
                                    <CheckCircle size={20} className="text-[#F7E7CE]" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Float Action */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0A0A0A] to-transparent">
                <button
                    onClick={onSeal}
                    disabled={!canSeal}
                    className={cn(
                        "w-full py-5 rounded-3xl text-[15px] font-bold tracking-tight flex items-center justify-center gap-3 transition-all shadow-2xl",
                        canSeal
                            ? "bg-white text-[#0A0A0A] hover:bg-gray-100 active:scale-[0.98]"
                            : "bg-white/10 text-white/20 cursor-not-allowed border border-white/5"
                    )}
                >
                    <Shield size={20} strokeWidth={1.5} />
                    {canSeal ? "Execute Protocol" : "Sign to Execute"}
                </button>
            </div>
        </div>
    );
}
