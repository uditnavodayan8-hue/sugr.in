'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Check, X, Clock, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface RequestItem {
    id: string;
    status: string;
    created_at: string;
    profile: {
        id: string;
        name: string;
        avatar_url: string | null;
        role: string;
        sugr_index: number;
    };
    is_incoming: boolean;
}

export default function RequestsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = getSupabaseClient();

    useEffect(() => {
        if (user) fetchRequests();
    }, [user]);

    const fetchRequests = async () => {
        if (!user) return;

        // Fetch Incoming
        const { data: incoming } = await supabase
            .from('access_requests')
            .select(`*, profile:profiles!access_requests_requester_id_fkey(id, name, avatar_url, role, sugr_index)`)
            .eq('target_id', user.id)
            .eq('status', 'pending');

        // Fetch Outgoing
        const { data: outgoing } = await supabase
            .from('access_requests')
            .select(`*, profile:profiles!access_requests_target_id_fkey(id, name, avatar_url, role, sugr_index)`)
            .eq('requester_id', user.id)
            .eq('status', 'pending');

        const incomingItems = (incoming || []).map((r: any) => ({ ...r, is_incoming: true }));
        const outgoingItems = (outgoing || []).map((r: any) => ({ ...r, is_incoming: false }));

        setRequests([...incomingItems, ...outgoingItems]);
        setLoading(false);
    };

    const handleAction = async (requestId: string, action: 'accepted' | 'rejected') => {
        const { error } = await supabase
            .from('access_requests')
            .update({ status: action })
            .eq('id', requestId);

        if (!error) {
            setRequests(prev => prev.filter(r => r.id !== requestId));
            toast.success(action === 'accepted' ? 'Vault Unlocked' : 'Request Removed');
        } else {
            toast.error('Action failed');
        }
    };

    if (loading) return <div className="p-8 text-center text-white/50">Decryption in progress...</div>;

    return (
        <main className="min-h-screen bg-[#0A0A0A] text-white pt-20 px-6 pb-24">
            <header className="mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tight mb-1">Access Log</h1>
                <p className="text-xs text-white/40 uppercase tracking-widest">Manage your vault permissions</p>
            </header>

            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                    <Lock className="w-12 h-12 mb-4" />
                    <p className="text-sm font-mono uppercase">No Pending Access Protocols</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* INCOMING */}
                    <section>
                        <h2 className="text-xs font-bold text-[#F7E7CE] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#F7E7CE] animate-pulse" />
                            Incoming Requests
                        </h2>
                        <div className="space-y-3">
                            {requests.filter(r => r.is_incoming).map(req => (
                                <div key={req.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={req.profile.avatar_url || ''} className="w-12 h-12 rounded-full object-cover grayscale" />
                                        <div>
                                            <h3 className="font-bold text-sm uppercase">{req.profile.name}</h3>
                                            <div className="text-[10px] text-white/50 uppercase">{req.profile.role} • Index {req.profile.sugr_index}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(req.id, 'rejected')}
                                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10"
                                        >
                                            <X size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.id, 'accepted')}
                                            className="w-10 h-10 rounded-full bg-[#F7E7CE] text-black flex items-center justify-center hover:scale-105"
                                        >
                                            <Check size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {requests.filter(r => r.is_incoming).length === 0 && (
                                <p className="text-[10px] text-white/20 italic pl-2">No incoming requests</p>
                            )}
                        </div>
                    </section>

                    {/* OUTGOING */}
                    <section>
                        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Pending Approval</h2>
                        <div className="space-y-3">
                            {requests.filter(r => !r.is_incoming).map(req => (
                                <div key={req.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between opacity-70">
                                    <div className="flex items-center gap-3">
                                        <img src={req.profile.avatar_url || ''} className="w-10 h-10 rounded-full object-cover grayscale" />
                                        <div>
                                            <h3 className="font-bold text-sm uppercase">{req.profile.name}</h3>
                                            <div className="text-[10px] text-white/50 flex items-center gap-1">
                                                <Clock size={10} />
                                                <span>Awaiting Access</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {requests.filter(r => !r.is_incoming).length === 0 && (
                                <p className="text-[10px] text-white/20 italic pl-2">No outgoing requests</p>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}
