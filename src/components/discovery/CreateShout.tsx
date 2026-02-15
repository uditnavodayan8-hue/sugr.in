'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Send, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { createAd } from '@/app/actions/ads';
import { toast } from 'sonner';

export default function CreateShout() {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Progressive Upload: user_id/timestamp_filename
            const filename = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;

            const { error } = await supabase.storage
                .from('shouts')
                .upload(filename, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('shouts')
                .getPublicUrl(filename);

            setMediaUrl(publicUrl);
        } catch (error) {
            console.error("Upload Error Details:", error);
            // @ts-ignore
            toast.error(`Upload failed: ${error.message || "Unknown error"}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!content && !mediaUrl) return;

        const formData = new FormData();
        formData.append('content', content);
        if (mediaUrl) formData.append('media_url', mediaUrl);

        // TODO: Get Geo Location here if needed

        const result = await createAd(formData);

        if (result.success) {
            toast.success("Shout posted!");
            setIsOpen(false);
            setContent('');
            setMediaUrl(null);
        } else {
            toast.error(result.error || "Failed to post");
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-[#F7E7CE] rounded-full flex items-center justify-center shadow-lg shadow-[#F7E7CE]/20 z-40 active:scale-95 transition-transform"
            >
                <Camera className="text-black" size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md bg-[#18181b] rounded-t-3xl sm:rounded-3xl border border-zinc-800 p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[#F7E7CE] font-serif text-xl tracking-wide">New Shout</h3>
                                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value.slice(0, 140))}
                                    placeholder="What's happening? (140 chars)"
                                    className="w-full bg-black/50 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#F7E7CE] resize-none h-32"
                                />

                                {mediaUrl && (
                                    <div className="relative rounded-xl overflow-hidden h-40 bg-black">
                                        <img src={mediaUrl} alt="Upload preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setMediaUrl(null)}
                                            className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-zinc-400 hover:text-[#F7E7CE] transition-colors p-2"
                                        disabled={uploading}
                                    >
                                        {uploading ? <Loader2 className="animate-spin" size={24} /> : <ImageIcon size={24} />}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*"
                                        className="hidden"
                                    />

                                    <button
                                        onClick={handleSubmit}
                                        disabled={(!content && !mediaUrl) || uploading}
                                        className="bg-[#F7E7CE] text-black px-6 py-2 rounded-full font-bold text-sm tracking-wide disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Send size={16} /> Broadcast
                                    </button>
                                </div>
                                <div className="text-right text-[10px] text-zinc-600 uppercase tracking-widest">
                                    {content.length}/140
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
