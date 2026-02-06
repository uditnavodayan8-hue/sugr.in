'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfilePhoto } from '@/lib/services/profilePhotos';

interface PhotoGalleryProps {
    photos: ProfilePhoto[];
    isOwner?: boolean;
    onAddPhoto?: () => void;
    onDeletePhoto?: (photoId: string) => void;
    className?: string;
}

export default function PhotoGallery({
    photos,
    isOwner = false,
    onAddPhoto,
    onDeletePhoto,
    className
}: PhotoGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const maxPhotos = 6;

    const handlePrev = () => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const handleNext = () => {
        if (selectedIndex !== null && selectedIndex < photos.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    return (
        <>
            {/* Grid View */}
            <div className={cn("grid grid-cols-3 gap-1", className)}>
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative aspect-square cursor-pointer group overflow-hidden bg-zinc-900"
                        onClick={() => setSelectedIndex(index)}
                    >
                        <img
                            src={photo.url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Delete button for owner */}
                        {isOwner && onDeletePhoto && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeletePhoto(photo.id);
                                }}
                                className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X size={12} className="text-white" />
                            </button>
                        )}

                        {/* Primary indicator */}
                        {photo.is_primary && (
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#F7E7CE] rounded text-[8px] font-bold text-black">
                                MAIN
                            </div>
                        )}
                    </motion.div>
                ))}

                {/* Add Photo Button (for owner) */}
                {isOwner && photos.length < maxPhotos && onAddPhoto && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={onAddPhoto}
                        className="aspect-square bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-[#F7E7CE] flex items-center justify-center transition-colors group"
                    >
                        <Plus size={24} className="text-zinc-600 group-hover:text-[#F7E7CE] transition-colors" />
                    </motion.button>
                )}
            </div>

            {/* Fullscreen Viewer */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setSelectedIndex(null)}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
                        >
                            <X size={24} className="text-white" />
                        </button>

                        {/* Navigation */}
                        {selectedIndex > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                className="absolute left-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft size={28} className="text-white" />
                            </button>
                        )}
                        {selectedIndex < photos.length - 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                className="absolute right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight size={28} className="text-white" />
                            </button>
                        )}

                        {/* Image */}
                        <motion.img
                            key={photos[selectedIndex]?.url}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            src={photos[selectedIndex]?.url}
                            alt=""
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Dots indicator */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {photos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all",
                                        index === selectedIndex ? "bg-[#F7E7CE] w-4" : "bg-white/40"
                                    )}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
