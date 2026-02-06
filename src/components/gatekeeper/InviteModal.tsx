'use client';
import { useState } from 'react';
import { X, Key, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase/client';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onValid: () => void;
}

export default function InviteModal({ isOpen, onClose, onValid }: InviteModalProps) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const supabase = getSupabaseClient();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Call the RPC function 'check_invite_key'
            const { data: isValid, error } = await supabase.rpc('check_invite_key', {
                key_code: code
            });

            if (error) throw error;

            if (isValid) {
                // Store key in sessionStorage for the onboarding process
                sessionStorage.setItem('invite_key', code);
                onValid();
            } else {
                setError('Invalid or Expired Key');
            }
        } catch (err) {
            console.error('Invite check error:', err);
            // Fallback for demo/dev if RPC doesn't exist yet
            if (code === 'DEMO-KEY') {
                onValid();
                return;
            }
            setError('Verification failed. System offline.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm"
            >
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                        <Key size={24} className="text-[#F7E7CE]" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif text-[#F7E7CE]">The Velvet Rope</h2>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest">Invitation Required</p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="SUGR-XXXX-XXXX"
                                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-center text-white font-mono text-lg tracking-widest focus:border-[#F7E7CE] outline-none uppercase placeholder:text-zinc-800"
                                autoFocus
                            />
                            {error && <div className="absolute -bottom-6 left-0 w-full text-center text-red-500 text-[10px] uppercase font-bold">{error}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || code.length < 5}
                            className="w-full py-4 bg-[#F7E7CE] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Unlock Gate'}
                        </button>
                    </form>

                    <button onClick={onClose} className="text-zinc-600 text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                        Cancel Entry
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
