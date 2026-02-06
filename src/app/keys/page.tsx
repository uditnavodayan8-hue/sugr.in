'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, Key, Copy, Check, Lock, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const MOCK_KEYS = [
    { id: 1, code: "SUGR-8X92-KLM1", status: "active", type: "Black" },
    { id: 2, code: "SUGR-3B77-QW99", status: "active", type: "Black" },
    { id: 3, code: "SUGR-1A44-VOID", status: "redeemed", type: "Gold", redeemer: "Sarah_K" },
];

export default function KeysPage() {
    const router = useRouter();
    const [keys, setKeys] = useState(MOCK_KEYS);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleCopy = (id: number, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white pb-24 font-serif">
            <header className="p-6 border-b border-zinc-900 flex justify-between items-center bg-[#050505]/95 backdrop-blur-md sticky top-0 z-50">
                <button onClick={() => router.back()} className="text-zinc-400 hover:text-white"><ArrowLeft size={20} /></button>
                <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-300">The Vault Keys</h1>
                <div className="w-5" />
            </header>

            <div className="p-6 space-y-8">
                {/* Intro */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mb-4">
                        <Key size={24} className="text-[#F7E7CE]" />
                    </div>
                    <h2 className="text-xl text-[#F7E7CE]">Curate Your Circle</h2>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                        You hold 3 keys to the Gate. Grant them only to those who match the standard.
                        <br />
                        <span className="text-red-900/80 uppercase font-bold text-[10px]">Warning: Bad invites affect your Trust Score.</span>
                    </p>
                </div>

                {/* Keys Grid */}
                <div className="space-y-4">
                    {keys.map((k, i) => (
                        <motion.div
                            key={k.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "relative p-4 rounded-xl border flex items-center gap-4 overflow-hidden group",
                                k.status === 'active' ? "bg-zinc-900/40 border-zinc-800 hover:border-[#F7E7CE]/30" : "bg-black border-zinc-900 opacity-60"
                            )}
                        >
                            {/* Background Gradient */}
                            {k.status === 'active' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F7E7CE]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            )}

                            {/* Status Icon */}
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border",
                                k.status === 'active' ? "bg-[#F7E7CE] text-black border-[#F7E7CE]" : "bg-zinc-900 text-zinc-600 border-zinc-800"
                            )}>
                                {k.status === 'active' ? <Key size={16} /> : <Lock size={16} />}
                            </div>

                            {/* Code Info */}
                            <div className="flex-1">
                                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                                    {k.status === 'active' ? 'Available Key' : `Redeemed by ${k.redeemer}`}
                                </div>
                                <div className={cn("font-mono text-lg tracking-wider", k.status === 'redeemed' && "line-through text-zinc-700")}>
                                    {k.code}
                                </div>
                            </div>

                            {/* Action */}
                            {k.status === 'active' && (
                                <button
                                    onClick={() => handleCopy(k.id, k.code)}
                                    className="p-3 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                >
                                    {copiedId === k.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Status */}
                <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={16} className="text-green-500" />
                        <div className="text-xs text-zinc-400">Invite Quality Score</div>
                    </div>
                    <div className="text-sm font-bold text-[#F7E7CE]">100%</div>
                </div>
            </div>
        </main>
    );
}
