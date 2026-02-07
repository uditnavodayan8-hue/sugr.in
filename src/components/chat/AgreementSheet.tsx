'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, DollarSign, Calendar, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgreementTerms {
    financialAmount?: string;
    financialFrequency?: 'weekly' | 'monthly' | 'per-meet';
    discretionLevel?: 'public' | 'private' | 'stealth';
    meetingFrequency?: string;
    notes?: string;
}

interface AgreementSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (terms: AgreementTerms) => void;
    partnerName: string;
    isProvider?: boolean;
}

const FREQUENCY_OPTIONS = [
    { value: 'per-meet', label: 'Per Meet' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

const DISCRETION_OPTIONS = [
    { value: 'public', label: 'Open', description: 'Can be seen together publicly' },
    { value: 'private', label: 'Private', description: 'Discreet meetings only' },
    { value: 'stealth', label: 'Stealth', description: 'Maximum discretion required' },
];

/**
 * Structured "Deal Sheet" for negotiating arrangement terms within chat.
 * Allows users to lock in Financial and Discretionary terms.
 */
export default function AgreementSheet({
    isOpen,
    onClose,
    onSubmit,
    partnerName,
    isProvider = false,
}: AgreementSheetProps) {
    const [terms, setTerms] = useState<AgreementTerms>({
        financialFrequency: 'monthly',
        discretionLevel: 'private',
    });
    const [step, setStep] = useState(1);

    const handleSubmit = () => {
        onSubmit(terms);
        onClose();
    };

    const updateTerms = (key: keyof AgreementTerms, value: string) => {
        setTerms(prev => ({ ...prev, [key]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-white/10 rounded-t-3xl max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-zinc-900 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    {isProvider ? 'Propose Terms' : 'Review Proposal'}
                                </h2>
                                <p className="text-xs text-white/40">
                                    with {partnerName}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/5"
                            >
                                <X size={20} className="text-white/60" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Warning */}
                            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-200/80 leading-relaxed">
                                    All agreements are between consenting adults. Sugr does not facilitate or endorse any illegal activities.
                                </p>
                            </div>

                            {/* Financial Terms */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign size={16} className="text-emerald-400" />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        Financial Terms
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Amount (e.g. $5,000)"
                                        value={terms.financialAmount || ''}
                                        onChange={(e) => updateTerms('financialAmount', e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-emerald-500/50 outline-none"
                                    />

                                    <div className="flex gap-2">
                                        {FREQUENCY_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => updateTerms('financialFrequency', opt.value)}
                                                className={cn(
                                                    "flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                                    terms.financialFrequency === opt.value
                                                        ? "bg-emerald-500 text-black"
                                                        : "bg-white/5 text-white/60 hover:bg-white/10"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Discretion Level */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-purple-400" />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        Discretion Level
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    {DISCRETION_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateTerms('discretionLevel', opt.value)}
                                            className={cn(
                                                "w-full p-4 rounded-xl text-left transition-all border",
                                                terms.discretionLevel === opt.value
                                                    ? "bg-purple-500/10 border-purple-500/30"
                                                    : "bg-white/5 border-transparent hover:border-white/10"
                                            )}
                                        >
                                            <span className="text-sm font-bold text-white">{opt.label}</span>
                                            <p className="text-xs text-white/40 mt-1">{opt.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Meeting Frequency */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-blue-400" />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        Availability
                                    </h3>
                                </div>

                                <input
                                    type="text"
                                    placeholder="e.g. 2-3 times per week"
                                    value={terms.meetingFrequency || ''}
                                    onChange={(e) => updateTerms('meetingFrequency', e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-blue-500/50 outline-none"
                                />
                            </section>

                            {/* Notes */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                    Additional Notes
                                </h3>
                                <textarea
                                    placeholder="Any other terms or expectations..."
                                    value={terms.notes || ''}
                                    onChange={(e) => updateTerms('notes', e.target.value)}
                                    rows={3}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/30 outline-none resize-none"
                                />
                            </section>

                            {/* Submit */}
                            <motion.button
                                onClick={handleSubmit}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
                            >
                                <Check size={16} />
                                {isProvider ? 'Send Proposal' : 'Accept Terms'}
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
