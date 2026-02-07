'use client';
import { useState, useRef, useEffect } from 'react';
import { X, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabaseClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const supabase = getSupabaseClient();

    // Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];
            digits.forEach((digit, i) => {
                if (index + i < 6) newOtp[index + i] = digit;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
        } else {
            const newOtp = [...otp];
            newOtp[index] = value.replace(/\D/g, '');
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Auto-verify when all digits entered
    useEffect(() => {
        if (otp.every(d => d) && sent) {
            handleVerifyOtp();
        }
    }, [otp, sent]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const trimmedEmail = email.trim();
        setEmail(trimmedEmail);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: trimmedEmail,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: `${window.location.origin}/auth/confirm`,
                }
            });

            if (error) throw error;
            setSent(true);
            setTimer(60); // Start 60s cooldown
            toast.success('Verification Code Sent', {
                description: 'Check your email for the 6-digit code.',
            });
        } catch (err: any) {
            console.error('OTP Send Error:', err);
            const msg = err.message || 'Failed to send code. Please try again.';
            setError(msg);
            toast.error('Failed to send code', { description: msg });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const code = otp.join('');
        if (code.length !== 6) return;

        setVerifying(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: code,
                type: 'email',
            });

            if (error) throw error;

            toast.success('Access Granted!');

            // Check onboarding status
            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('name, avatar_url')
                    .eq('id', data.user.id)
                    .single();

                if (profile?.name && profile?.avatar_url) {
                    router.push('/dashboard');
                } else {
                    router.push('/onboarding');
                }
            }
        } catch (err: any) {
            console.error('OTP Verify Error:', err);
            const msg = err.message || 'Invalid code. Please try again.';
            setError(msg);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            toast.error('Verification Failed', { description: msg });
        } finally {
            setVerifying(false);
        }
    };

    const resetFlow = () => {
        setSent(false);
        setOtp(['', '', '', '', '', '']);
        setError(null);
        setTimer(0);
    };

    // Resend handler
    const handleResend = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission if inside form
        handleSendOtp(e as unknown as React.FormEvent);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-sm relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-serif text-[#F7E7CE] mb-6 tracking-wide">Enter the Gate</h2>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-300">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {sent ? (
                    <div className="space-y-6">
                        {/* OTP Icon */}
                        <div className="w-16 h-16 bg-[#F7E7CE]/10 rounded-full flex items-center justify-center mx-auto">
                            <KeyRound size={32} className="text-[#F7E7CE]" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-white text-lg font-bold mb-2">Enter Code</h3>
                            <p className="text-zinc-400 text-sm">We sent a 6-digit code to <span className="text-white">{email}</span></p>
                        </div>

                        {/* OTP Input */}
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-11 h-14 bg-black border border-zinc-700 rounded-xl text-center text-white text-xl font-bold focus:border-[#F7E7CE] outline-none transition-colors"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        {verifying && (
                            <p className="text-center text-[#F7E7CE] text-sm animate-pulse">Verifying...</p>
                        )}

                        {/* Resend Timer */}
                        <div className="text-center">
                            {timer > 0 ? (
                                <p className="text-zinc-500 text-xs">Resend code in {timer}s</p>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    className="text-xs text-[#F7E7CE] hover:underline"
                                >
                                    Resend Code
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={resetFlow}
                            className="w-full text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-widest mt-4"
                        >
                            Use different email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="private@example.com"
                                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#F7E7CE] outline-none"
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || (timer > 0) || !email}
                            className="w-full py-3 bg-[#F7E7CE] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : (timer > 0 ? `Wait ${timer}s` : 'Get Verification Code')} <ArrowRight size={14} />
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-600">Or</span></div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSent(true)}
                            className="w-full py-3 bg-zinc-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <KeyRound size={16} /> I already have a code
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
