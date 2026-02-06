'use client';
import { Lock, Upload, Key, Check, X, RefreshCw, ScanFace, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/hooks/useOnboarding';
import { uploadFile } from '@/lib/supabase/upload';
import { useAuth } from '@/context/AuthContext';

interface StepProps {
    onNext: () => void;
}

export default function Step5_Vetting({ onNext }: StepProps) {
    const { user } = useAuth();
    const { data, updateData, completeOnboarding, saving } = useOnboarding();

    // --- Secret Album State ---
    const [uploads, setUploads] = useState<Record<number, string>>({});
    const albumInputRef = useRef<HTMLInputElement>(null);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);

    // --- ID Doc State ---
    const [idDoc, setIdDoc] = useState<string | null>(data.idDocUrl || null);
    const idInputRef = useRef<HTMLInputElement>(null);

    // --- Face Verification State ---
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [faceImage, setFaceImage] = useState<string | null>(data.faceImageUrl || null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [error, setError] = useState<string | null>(null);

    // Secret Album Handlers
    const handleSlotClick = (index: number) => {
        setActiveSlot(index);
        albumInputRef.current?.click();
    };

    const handleAlbumFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeSlot !== null && user) {
            setUploading(true);
            try {
                const url = await uploadFile(file, 'vault', `${user.id}/secret-${activeSlot}`);
                setUploads(prev => ({ ...prev, [activeSlot]: url }));
            } catch (err) {
                setError('Failed to upload image');
            }
            setUploading(false);
        }
    };

    const removePhoto = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setUploads(prev => {
            const newUploads = { ...prev };
            delete newUploads[index];
            return newUploads;
        });
    };

    // ID Doc Handlers
    const handleIdClick = () => idInputRef.current?.click();
    const handleIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user) {
            setUploading(true);
            try {
                const url = await uploadFile(file, 'verification', `${user.id}/id`);
                setIdDoc(url);
                updateData({ idDocUrl: url });
            } catch (err) {
                setError('Failed to upload ID document');
            }
            setUploading(false);
        }
    };

    // Camera Handlers
    const startCamera = async () => {
        setIsCameraActive(true);
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("Camera access denied. Please enable camera permissions.");
            setIsCameraActive(false);
        }
    };

    const captureFace = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                setFaceImage(dataUrl);
                updateData({ faceImageUrl: dataUrl });
                stopCamera();
            }
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const handleComplete = async () => {
        updateData({ secretAlbum: Object.values(uploads) });
        const success = await completeOnboarding();
        if (success) {
            onNext();
        } else {
            setError('Failed to complete onboarding. Please try again.');
        }
    };

    const isComplete = idDoc && faceImage && Object.keys(uploads).length > 0;

    return (
        <div className="space-y-10">
            <header className="text-center space-y-4">
                <h2 className="text-4xl font-serif tracking-tight">Vetting</h2>
                <p className="text-zinc-500 text-sm italic">"Verification is the ultimate luxury."</p>
            </header>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-900/30 border border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-300">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Hidden Inputs */}
            <input type="file" ref={albumInputRef} className="hidden" accept="image/*" onChange={handleAlbumFileChange} />
            <input type="file" ref={idInputRef} className="hidden" accept="image/*" onChange={handleIdChange} />

            <div className="space-y-6">
                {/* 1. ID Verification */}
                <div
                    onClick={handleIdClick}
                    className={cn(
                        "p-4 border border-dashed rounded-xl flex items-center justify-between cursor-pointer transition-colors",
                        idDoc ? "border-[#F7E7CE] bg-zinc-900" : "border-zinc-800 hover:bg-zinc-900/50"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-full", idDoc ? "bg-[#F7E7CE] text-black" : "bg-zinc-900 text-zinc-500")}>
                            {idDoc ? <Check size={18} /> : <Upload size={18} />}
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Gov ID / Passport</h4>
                            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{idDoc ? "Document Uploaded" : "Required for verified badge"}</p>
                        </div>
                    </div>
                    {idDoc && (
                        <div className="w-10 h-8 relative rounded overflow-hidden">
                            <img src={idDoc} className="w-full h-full object-cover opacity-50" alt="ID" />
                        </div>
                    )}
                </div>

                {/* 2. Face Verification (Camera) */}
                <div className="space-y-2">
                    <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                        <ScanFace size={12} /> Liveness Check
                    </h4>

                    <div className="relative aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center">
                        {isCameraActive ? (
                            <>
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                                <button
                                    onClick={captureFace}
                                    className="absolute bottom-4 px-6 py-2 bg-white text-black text-xs font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
                                >
                                    CAPTURE
                                </button>
                            </>
                        ) : faceImage ? (
                            <div className="relative w-full h-full">
                                <img src={faceImage} alt="Face" className="w-full h-full object-cover transform scale-x-[-1]" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2 text-[#F7E7CE]">
                                        <Check size={32} />
                                        <span className="text-[10px] uppercase tracking-widest">Captured</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFaceImage(null)}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-zinc-800"
                                >
                                    <RefreshCw size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center space-y-2">
                                <p className="text-[10px] text-zinc-600">Camera access required for liveness</p>
                                <button
                                    onClick={startCamera}
                                    className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-300 hover:text-white hover:border-[#F7E7CE] transition-all"
                                >
                                    Enable Camera
                                </button>
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                </div>

                {/* 3. Secret Album */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                            <Lock size={12} /> Secret Album
                        </h4>
                        {uploading && <span className="text-[9px] text-[#F7E7CE]">Uploading...</span>}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                onClick={() => handleSlotClick(i)}
                                className={cn(
                                    "aspect-square rounded-lg flex items-center justify-center border cursor-pointer relative overflow-hidden group transition-all duration-300",
                                    uploads[i] ? "bg-zinc-900 border-[#F7E7CE]" : "bg-zinc-950 border-zinc-800"
                                )}
                            >
                                {uploads[i] ? (
                                    <>
                                        <img src={uploads[i]} className="w-full h-full object-cover blur-sm opacity-80" alt="Secret" />
                                        <button onClick={(e) => removePhoto(e, i)} className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full">
                                            <X size={10} />
                                        </button>
                                    </>
                                ) : (
                                    <Key size={16} className="text-zinc-600 group-hover:text-[#F7E7CE]" />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-[9px] text-zinc-600 text-center">Upload at least 1 photo for your private album</p>
                </div>
            </div>

            <div className="pt-2">
                <button
                    onClick={handleComplete}
                    disabled={!isComplete || saving || uploading}
                    className="w-full py-5 bg-[#F7E7CE] text-black text-xs font-black tracking-[0.3em] uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Completing...' : 'Complete Application'}
                </button>
            </div>
        </div>
    );
}
