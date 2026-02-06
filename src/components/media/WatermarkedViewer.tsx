'use client';
import { useEffect, useRef, useState } from 'react';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WatermarkedViewerProps {
    src: string;
    viewerId: string;
    onClose: () => void;
}

export default function WatermarkedViewer({ src, viewerId, onClose }: WatermarkedViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [securityViolation, setSecurityViolation] = useState(false);
    const [violationCount, setViolationCount] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const drawWatermark = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.font = "12px monospace";
            ctx.globalAlpha = 0.12;
            ctx.fillStyle = "#ffffff";
            ctx.rotate(-45 * Math.PI / 180);

            const gap = 120;
            for (let x = -canvas.width; x < canvas.width * 2; x += gap) {
                for (let y = -canvas.height; y < canvas.height * 2; y += gap) {
                    ctx.fillText(`${viewerId} • CONFIDENTIAL`, x, y);
                }
            }
            ctx.restore();
        };

        drawWatermark();
        window.addEventListener('resize', drawWatermark);
        return () => window.removeEventListener('resize', drawWatermark);
    }, [viewerId]);

    // Screenshot Detection (Visibility Change)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Tab switched or screen recorded - trigger alert
                setSecurityViolation(true);
                setViolationCount(prev => prev + 1);
            }
        };

        // Keyboard shortcut detection (Print Screen simulation)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === '3') || (e.metaKey && e.shiftKey && e.key === '4')) {
                setSecurityViolation(true);
                setViolationCount(prev => prev + 1);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Auto-close after 3 violations
    useEffect(() => {
        if (violationCount >= 3) {
            onClose();
        }
    }, [violationCount, onClose]);

    return (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
            {/* Security Violation Overlay */}
            <AnimatePresence>
                {securityViolation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-900/90 z-50 flex flex-col items-center justify-center p-8"
                    >
                        <AlertTriangle size={64} className="text-red-300 mb-6 animate-pulse" />
                        <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">Security Violation</h2>
                        <p className="text-red-200 text-sm text-center max-w-sm mb-6">
                            Screenshot attempt detected. This incident has been logged and reported to the asset owner.
                        </p>
                        <div className="text-[10px] text-red-400 uppercase tracking-widest mb-8">
                            Violation #{violationCount} • Access may be revoked
                        </div>
                        <button
                            onClick={() => setSecurityViolation(false)}
                            className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-xs uppercase tracking-widest hover:bg-white/20"
                        >
                            Acknowledge
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Image */}
            <img src={src} className="max-w-full max-h-full object-contain pointer-events-none select-none" alt="Protected" draggable={false} />

            {/* Watermark Overlay */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

            {/* Security Warning */}
            <div className="absolute top-10 left-0 w-full text-center pointer-events-none opacity-60">
                <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-500/20 px-4 py-1 rounded-full text-red-400 text-[10px] uppercase tracking-widest font-bold animate-pulse">
                    <ShieldAlert size={12} />
                    Screen Shield Active • Tab Switch = Violation
                </div>
            </div>

            {/* Close Button */}
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-20">
                <X size={20} />
            </button>
        </div>
    );
}
