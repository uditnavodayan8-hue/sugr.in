'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { uploadAvatar } from '@/app/actions/uploadAvatar';

interface Step3_PhotosProps {
    onBack: () => void;
    onComplete: (photoUrl: string) => void;
    loading?: boolean;
}

export default function Step3_Photos({ onBack, onComplete, loading }: Step3_PhotosProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUploadAndComplete = async () => {
        if (!file) {
            toast.error('Please select a photo');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadAvatar(formData);

            if (result.success && result.publicUrl) {
                onComplete(result.publicUrl);
            } else {
                toast.error('Upload failed', { description: result.error || 'Unknown error' });
                setUploading(false);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error('Failed to upload', { description: error.message });
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg space-y-8 p-6"
        >
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif italic">First Impressions</h1>
                <p className="text-white/40 text-sm">Upload a high-quality photo to stand out</p>
            </div>

            <div className="space-y-8 flex flex-col items-center">
                {/* Photo Preview Area */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "relative w-64 h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group",
                        preview ? "border-white/50 bg-black" : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                    )}
                >
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-bold uppercase tracking-widest text-sm">Change Photo</p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-4 p-4">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                                <Camera size={32} className="text-white/50" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white/80 font-bold">Tap to Upload</p>
                                <p className="text-white/30 text-xs">Recommended: Portrait, Clear Lighting</p>
                            </div>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Actions */}
                <div className="w-full space-y-3">
                    <button
                        onClick={handleUploadAndComplete}
                        disabled={!file || uploading || loading}
                        className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {uploading || loading ? (
                            <span className="animate-pulse">Finalizing Profile...</span>
                        ) : (
                            <>
                                Complete Profile <Check size={18} />
                            </>
                        )}
                    </button>

                    <button
                        onClick={onBack}
                        disabled={uploading || loading}
                        className="w-full text-center text-white/40 text-xs hover:text-white/60 py-2"
                    >
                        Back to Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
