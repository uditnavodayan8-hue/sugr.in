'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, User, DollarSign, Camera, Check, Link, Instagram, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export type VerificationType = 'phone' | 'id' | 'social' | 'wealth';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: VerificationType | null;
    currentStatus?: boolean;
    onVerify: (type: VerificationType, data: any) => Promise<void>;
}

export default function VerificationModal({
    isOpen,
    onClose,
    type,
    currentStatus,
    onVerify
}: VerificationModalProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'info' | 'input' | 'processing' | 'success'>('info');
    const [inputValue, setInputValue] = useState('');

    if (!isOpen || !type) return null;

    const config = {
        phone: {
            title: 'Verify Phone Number',
            description: 'Link your phone number to secure your account and enable SMS notifications.',
            icon: Smartphone,
            color: '#F7E7CE',
            actionText: 'Send Code',
        },
        id: {
            title: 'Government ID',
            description: 'Upload a government-issued ID (Passport, Driver\'s License) to get the Verified Badge.',
            icon: User,
            color: '#3B82F6',
            actionText: 'Upload ID',
        },
        social: {
            title: 'Social Media',
            description: 'Connect your Instagram to show your authentic self.',
            icon: Instagram,
            color: '#E1306C',
            actionText: 'Connect Instagram',
        },
        wealth: {
            title: 'Financial Status',
            description: 'Verify your income or assets to unlock exclusive tiers.',
            icon: DollarSign,
            color: '#10B981',
            actionText: 'Verify Assets',
        }
    }[type];

    const handleAction = async () => {
        if (step === 'info') {
            setStep('input');
        } else if (step === 'input') {
            setLoading(true);
            setStep('processing');
            try {
                // Mock delay for "verification"
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Call the actual verification handler
                await onVerify(type, { value: inputValue });

                setStep('success');
                setTimeout(() => {
                    onClose();
                    setStep('info');
                    setInputValue('');
                }, 1500);
            } catch (error) {
                console.error(error);
                toast.error('Verification failed. Please try again.');
                setStep('input');
            } finally {
                setLoading(false);
            }
        }
    };

    const renderContent = () => {
        switch (step) {
            case 'success':
                return (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <Check size={32} className="text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Verified!</h3>
                        <p className="text-white/60">Your {config.title} has been successfully verified.</p>
                    </div>
                );

            case 'processing':
                return (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Loader2 size={48} className="text-[#F7E7CE] animate-spin mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Verifying...</h3>
                        <p className="text-white/60 text-sm">Please wait while we check your details.</p>
                    </div>
                );

            case 'input':
                return (
                    <div className="space-y-4 py-4">
                        {type === 'phone' && (
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F7E7CE]"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoFocus
                            />
                        )}
                        {type === 'id' && (
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer">
                                <Camera size={32} className="text-white/40 mb-3" />
                                <p className="text-sm text-white/60">Tap to take a photo or upload</p>
                            </div>
                        )}
                        {type === 'social' && (
                            <button className="w-full flex items-center justify-center gap-2 bg-[#E1306C] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                                <Instagram size={20} />
                                Connect Instagram
                            </button>
                        )}
                        {type === 'wealth' && (
                            <div className="text-center p-4 bg-white/5 rounded-xl">
                                <p className="text-sm text-white/60 mb-4">We use Stripe Identity to verify your financial status securely.</p>
                                <LockIcon className="w-8 h-8 text-white/20 mx-auto mb-2" />
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="text-center py-6">
                        <p className="text-white/70 leading-relaxed mb-6">
                            {config.description}
                        </p>
                        {currentStatus ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                                <Check size={14} />
                                Already Verified
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                                <ShieldIcon className="w-4 h-4" />
                                Secure & Confidential
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl overflow-hidden relative z-10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${config.color}20` }}
                                >
                                    <config.icon size={20} style={{ color: config.color }} />
                                </div>
                                <h2 className="text-lg font-bold text-white">{config.title}</h2>
                            </div>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {renderContent()}
                        </div>

                        {/* Footer */}
                        {step !== 'success' && step !== 'processing' && (
                            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                                <button
                                    onClick={handleAction}
                                    disabled={loading || (step === 'input' && type === 'phone' && !inputValue)}
                                    className="w-full py-3.5 bg-[#F7E7CE] text-black font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {step === 'info' ? config.actionText : (loading ? <Loader2 className="animate-spin" /> : 'Confirm')}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function ShieldIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}

function LockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
}
