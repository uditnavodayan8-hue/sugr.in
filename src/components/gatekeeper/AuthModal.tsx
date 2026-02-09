'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Smartphone, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
// @ts-ignore
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useSignIn, useSignUp } from '@clerk/nextjs';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { isLoaded, signIn, setActive } = useSignIn();
    const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
    const router = useRouter();

    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded || !isSignUpLoaded || !signIn || !signUp) return;
        setLoading(true);

        try {
            // Try to start sign in first
            try {
                const { supportedFirstFactors } = await signIn.create({
                    identifier: phone,
                });

                const isPhoneCodeFactor = supportedFirstFactors?.find(
                    (factor) => factor.strategy === 'phone_code'
                );

                if (isPhoneCodeFactor) {
                    const { phoneNumberId } = isPhoneCodeFactor as any;
                    await signIn.prepareFirstFactor({
                        strategy: 'phone_code',
                        phoneNumberId,
                    });
                    setStep('otp');
                    toast.success('Code sent', { description: 'Check your messages.' });
                    setLoading(false);
                    return;
                }
            } catch (err) {
                // Proceed to sign up
            }

            // Fallback to Sign Up
            try {
                await signUp.create({
                    phoneNumber: phone,
                });

                await signUp.preparePhoneNumberVerification({
                    strategy: 'phone_code',
                });

                setStep('otp');
                toast.success('Code sent', { description: 'Welcome to sugr.' });

            } catch (err: any) {
                if (err.errors?.[0]?.code === 'form_identifier_exists') {
                    toast.error("Account exists. Please try again.");
                } else {
                    toast.error(err.errors?.[0]?.message || "Failed to send code.");
                }
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded || !isSignUpLoaded || !signIn || !signUp) return;
        if (!isLoaded || !isSignUpLoaded || !signIn || !signUp) return;
        setLoading(true);

        try {
            // Try finalizing Sign In first
            try {
                const result = await signIn.attemptFirstFactor({
                    strategy: 'phone_code',
                    code: otp,
                });

                if (result.status === 'complete') {
                    await setActive({ session: result.createdSessionId });
                    toast.success('Access Granted');
                    router.push('/dashboard');
                    onClose();
                    return;
                }
            } catch (err) {
                // Try sign up
            }

            // Try finalizing Sign Up
            try {
                const result = await signUp.attemptPhoneNumberVerification({
                    code: otp,
                });

                if (result.status === 'complete') {
                    await setSignUpActive({ session: result.createdSessionId });
                    toast.success('Access Granted');
                    router.push('/onboarding');
                    onClose();
                    return;
                }
            } catch (err: any) {
                toast.error(err.errors?.[0]?.message || "Invalid Code");
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm relative"
            >
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl">
                    <AnimatePresence mode="wait">
                        {step === 'phone' ? (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-serif text-white tracking-wider">sugr.</h2>
                                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Member Access</p>
                                </div>

                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Smartphone className="h-4 w-4 text-zinc-500 group-focus-within:text-[#F7E7CE]" />
                                        </div>
                                        <PhoneInput
                                            placeholder="Enter Phone Number"
                                            value={phone}
                                            onChange={(value: string | undefined) => setPhone(value || '')}
                                            defaultCountry="IN"
                                            className="w-full bg-black border border-zinc-700 rounded-xl px-10 py-3 text-white outline-none focus-within:border-[#F7E7CE] transition-colors"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !phone}
                                        className="w-full py-3 bg-[#F7E7CE] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Enter <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-serif text-[#F7E7CE]">Verify Identity</h2>
                                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Sent to {phone}</p>
                                </div>

                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full bg-black border-b-2 border-zinc-700 text-center text-3xl text-white font-mono py-2 outline-none focus:border-[#F7E7CE] tracking-[0.5em] placeholder:text-zinc-800"
                                        autoFocus
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading || otp.length < 6}
                                        className="w-full py-3 bg-[#DC143C] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Confirm'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStep('phone')}
                                        className="w-full text-zinc-600 text-[10px] uppercase tracking-widest hover:text-white"
                                    >
                                        Back
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}