import { motion, AnimatePresence } from 'framer-motion';
import { Lock, BadgeCheck, MapPin, Activity, KeyRound, Send } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Profile } from '@/lib/services/profiles';
import { sendAccessRequest, checkAccessStatus } from '@/lib/services/access';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/Skeleton';

interface ProfileCardProps {
    profile: Profile;
    onRemove?: (id: string) => void;
}

export default function ProfileCard({ profile, onRemove }: ProfileCardProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [accessStatus, setAccessStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none');
    const [photoIndex, setPhotoIndex] = useState(0);
    const [loadingAction, setLoadingAction] = useState(false);

    // Initial Access Check
    useEffect(() => {
        if (user && profile.id) {
            checkAccessStatus(user.id, profile.id).then(setAccessStatus);
        }
    }, [user, profile.id]);

    // Calculate available photos
    const photos = useMemo(() => {
        if (profile.photos && profile.photos.length > 0) {
            return profile.photos;
        }
        return [{ id: 'main', url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' }];
    }, [profile]);

    const currentPhoto = photos[photoIndex];
    const isVaultLocked = accessStatus !== 'accepted';

    const handleRequestAccess = async () => {
        if (!user || loadingAction) return;
        setLoadingAction(true);

        // Haptic feedback (if available)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        try {
            const { success, error } = await sendAccessRequest(user.id, profile.id);
            if (success) {
                setAccessStatus('pending');
                // Success haptic
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                toast.success('Access Request Sent', {
                    description: 'Waiting for approval to unlock Private Vault.'
                });
            } else {
                toast.error('Request failed');
            }
        } catch {
            toast.error('Connection failed');
        } finally {
            setLoadingAction(false);
        }
    };

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (photoIndex < photos.length - 1) setPhotoIndex(prev => prev + 1);
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (photoIndex > 0) setPhotoIndex(prev => prev - 1);
    };

    return (
        <motion.div
            className="relative w-full h-[85vh] bg-[#050505] overflow-hidden select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* FULL BLEED IMAGE LAYER */}
            <motion.div
                className="absolute inset-0 z-0"
                key={currentPhoto.url}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <img
                    src={currentPhoto.url}
                    alt=""
                    className={cn(
                        "w-full h-full object-cover filter brightness-[0.85] contrast-[1.1] transition-all duration-700",
                        // VAULT BLUR LOGIC: Blur all except first photo if locked OR always blur if sensitive
                        (isVaultLocked && photoIndex > 0) ? "blur-xl scale-110" : "blur-0"
                    )}
                    draggable={false}
                />

                {/* Vault Overlay Message */}
                {isVaultLocked && photoIndex > 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
                        <Lock className="w-12 h-12 text-white/50 mb-4" />
                        <h3 className="text-xl font-bold uppercase tracking-widest text-white">Private Vault</h3>
                        <p className="text-xs text-white/60 mt-2 uppercase tracking-wider">Request Access to Unlock</p>
                    </div>
                )}

                {/* Noir Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>

            {/* NAVIGATION ZONES */}
            <div className="absolute inset-0 z-10 flex">
                <div className="w-1/2 h-full" onClick={prevPhoto} />
                <div className="w-1/2 h-full" onClick={nextPhoto} />
            </div>

            {/* DOSSIER HEADER (Top Left) */}
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                            {profile.name}
                        </h1>
                        {profile.is_verified_provider && (
                            <BadgeCheck className="text-[#DC143C] w-6 h-6" fill="currentColor" stroke="black" />
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-white/60 text-sm font-mono uppercase tracking-widest">
                        <span>{profile.age}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <MapPin size={12} /> {profile.city}
                        </span>
                    </div>
                </div>
            </div>

            {/* SUGR INDEX (Top Right) */}
            <div className="absolute top-6 right-6 z-20 text-right pointer-events-none">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">Sugr Index</span>
                    <div className="flex items-baseline gap-1">
                        <Activity size={14} className="text-[#DC143C]" />
                        <span className="text-3xl font-bold text-white tracking-tighter">
                            {profile.sugr_index || 50}
                        </span>
                    </div>
                </div>
            </div>

            {/* PHOTO INDICATORS (Left Edge) */}
            <div className="absolute left-6 bottom-32 z-20 flex flex-col gap-2">
                {photos.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-1 h-8 transition-all duration-300",
                            i === photoIndex ? "bg-[#DC143C]" : "bg-white/20"
                        )}
                    />
                ))}
            </div>

            {/* DOSSIER DETAILS (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full p-8 z-30 pointer-events-none">
                <div className="flex items-end justify-between">
                    <div className="max-w-[70%]">
                        <div className="inline-block px-3 py-1 border border-white/20 text-white/80 text-[10px] uppercase tracking-widest mb-4">
                            {profile.role} • {profile.lifestyle_tier || 'Standard'}
                        </div>
                        <p className="text-lg text-white/90 leading-relaxed font-light line-clamp-3">
                            {profile.bio}
                        </p>
                    </div>
                </div>
            </div>

            {/* INTERACTION CONTROLS - REPLACED WITH ACCESS HANDSHAKE */}
            <div className="absolute bottom-8 right-8 z-40 flex flex-col gap-4">
                <button
                    onClick={() => onRemove?.(profile.id)}
                    className="w-16 h-16 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center group hover:bg-white/10 transition-all"
                >
                    <span className="text-white/40 group-hover:text-white text-xl">✕</span>
                </button>

                {accessStatus === 'none' && (
                    <motion.button
                        onClick={handleRequestAccess}
                        disabled={loadingAction}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 rounded-full bg-[#DC143C] flex items-center justify-center shadow-[0_0_30px_rgba(220,20,60,0.4)]"
                    >
                        {loadingAction ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                            />
                        ) : (
                            <KeyRound size={24} className="text-white" />
                        )}
                    </motion.button>
                )}

                {accessStatus === 'pending' && (
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
                        <Send size={20} className="text-white/60 mb-1" />
                        <span className="text-[8px] uppercase tracking-widest text-white/60">Sent</span>
                    </div>
                )}

                {accessStatus === 'accepted' && (
                    <button
                        onClick={() => router.push(`/chat?match=${profile.id}`)}
                        className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex flex-col items-center justify-center backdrop-blur-md"
                    >
                        <Lock size={20} className="text-emerald-500 mb-1" />
                        <span className="text-[8px] uppercase tracking-widest text-emerald-500">Open</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}
