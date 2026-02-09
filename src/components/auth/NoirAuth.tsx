'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
// @ts-ignore
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';
import { useSignIn, useSignUp } from '@clerk/nextjs';

export default function NoirAuth() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
    const router = useRouter();

    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded || !isSignUpLoaded) return;

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
                    // Phone number exists, send code
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
            } catch (err: any) {
                // If user not found (error code for user not found varies but safe to assume we should try sign up)
                console.log("Sign in failed, attempting sign up...", err);
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
                // Check if error is "already exists" but caught in race condition
                if (err.errors?.[0]?.code === 'form_identifier_exists') {
                    toast.error("Account exists. Please try again.");
                } else {
                    toast.error(err.errors?.[0]?.message || "Failed to send code.");
                }
            }

        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded || !isSignUpLoaded) return;
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
                    toast.success('Access Granted - Welcome Back');
                    router.push('/dashboard');
                    return;
                }
            } catch (err) {
                // Ignore and try sign up
            }

            // Try finalizing Sign Up
            try {
                const result = await signUp.attemptPhoneNumberVerification({
                    code: otp,
                });

                if (result.status === 'complete') {
                    await setSignUpActive({ session: result.createdSessionId });
                    toast.success('Access Granted - Account Created');
                    router.push('/onboarding');
                    return;
                }
            } catch (err: any) {
                toast.error(err.errors?.[0]?.message || "Invalid Code");
            }
        } catch (err: any) {
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
            {/* 1. Background Video */}
            <div className={cn(
                "absolute inset-0 z-0 transition-all duration-1000",
                step === 'otp' ? "blur-sm opacity-50" : "opacity-80"
            )}>
                {/* Placeholder for video - in production use a real <video> tag */}
                {/* For now, using an abstract dark gradient that simulates the 'Noir' feel if video fails */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster="https://images.pexels.com/photos/3195394/pexels-photo-3195394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                >
                    <source src="https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60" /> {/* Overlay */}
            </div>

            {/* 2. The Interaction Container */}
            <div className="relative z-10 w-full max-w-md px-6">
                <AnimatePresence mode="wait">

                    {/* PHONE STEP */}
                    {step === 'phone' && (
                        <motion.div
                            key="phone-step"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-serif text-white tracking-wider">sugr.</h1>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Restricted Access</p>
                            </div>

                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Smartphone className="h-4 w-4 text-zinc-500 group-focus-within:text-[#F7E7CE] transition-colors" />
                                    </div>
                                    <PhoneInput
                                        placeholder="Enter Phone Number"
                                        value={phone}
                                        onChange={(value: string | undefined) => setPhone(value || '')}
                                        className="w-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-white rounded-xl px-12 py-4 outline-none focus-within:border-[#F7E7CE] focus-within:shadow-[0_0_20px_rgba(247,231,206,0.1)] transition-all font-mono text-lg"
                                        defaultCountry="IN"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !phone}
                                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#F7E7CE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Request Access <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* OTP STEP */}
                    {step === 'otp' && (
                        <motion.div
                            key="otp-step"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-serif text-[#F7E7CE] tracking-wider animate-pulse">Verify Identity</h1>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Code sent to {phone}</p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="• • • • • •"
                                    maxLength={6}
                                    className="w-full bg-black/50 border-b-2 border-zinc-700 text-center text-4xl text-white font-mono py-4 outline-none focus:border-[#F7E7CE] focus:shadow-[0_0_30px_rgba(247,231,206,0.2)] transition-all tracking-[0.5em] placeholder:text-zinc-800"
                                    autoFocus
                                />

                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full py-4 bg-[#6E0D25] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#8B1030] transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(110,13,37,0.4)] flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Confirm Entry'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    className="w-full text-zinc-600 text-[10px] uppercase tracking-widest hover:text-zinc-400"
                                >
                                    Change Number
                                </button>
                            </form>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Aesthetic Detail: Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />
        </div>
    );
}
