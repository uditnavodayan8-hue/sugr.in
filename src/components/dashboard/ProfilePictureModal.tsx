import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePictureModalProps {
    userId: string;
    onComplete: () => void;
    onSkip: () => void;
}

export default function ProfilePictureModal({ userId, onComplete, onSkip }: ProfilePictureModalProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
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

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Server Action (Bypasses RLS)
            const { uploadAvatar } = await import('@/app/actions/uploadAvatar');
            const result = await uploadAvatar(formData);

            if (result.success) {
                toast.success('Profile picture updated!');
                onComplete();
                // Force reload to see new image if needed, or rely on revalidatePath
                window.location.reload();
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error('Failed to upload', { description: error.message });
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-900 rounded-3xl p-8 max-w-sm w-full border border-white/10"
            >
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif">Add Your Photo</h2>
                        <p className="text-white/50 text-sm">Show others who you are</p>
                    </div>

                    {/* Preview Circle */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:border-white/50 transition-colors overflow-hidden bg-white/5"
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <Camera size={32} className="text-white/30" />
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
                    <div className="space-y-3">
                        {preview ? (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {uploading ? (
                                    <span className="animate-pulse">Uploading...</span>
                                ) : (
                                    <>
                                        <Check size={18} /> Save Photo
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
                            >
                                <Upload size={18} /> Choose Photo
                            </button>
                        )}

                        <button
                            onClick={onSkip}
                            className="w-full text-white/40 text-sm hover:text-white/60 transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
