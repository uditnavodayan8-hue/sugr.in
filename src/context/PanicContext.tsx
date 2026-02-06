'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NewsFacade from '@/components/panic/NewsFacade';

interface PanicContextType {
    isPanicMode: boolean;
    togglePanic: () => void;
}

const PanicContext = createContext<PanicContextType | undefined>(undefined);

export function PanicProvider({ children }: { children: ReactNode }) {
    const [isPanicMode, setIsPanicMode] = useState(false);
    const [keySequence, setKeySequence] = useState<string[]>([]);

    const togglePanic = () => setIsPanicMode(prev => !prev);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Logic: Triple tap 'Escape' to Panic
            if (e.key === 'Escape') {
                setKeySequence(prev => {
                    const newSeq = [...prev, 'Escape'];
                    if (newSeq.length >= 3) {
                        // Trigger Panic
                        setIsPanicMode(true);
                        return [];
                    }
                    // Reset sequence after 500ms if not completed
                    setTimeout(() => setKeySequence([]), 500);
                    return newSeq;
                });
            }

            // Also support a specific combo if needed (e.g. Ctrl + Shift + P)
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                setIsPanicMode(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <PanicContext.Provider value={{ isPanicMode, togglePanic }}>
            {isPanicMode ? <NewsFacade /> : children}
        </PanicContext.Provider>
    );
}

export function usePanic() {
    const context = useContext(PanicContext);
    if (context === undefined) {
        throw new Error('usePanic must be used within a PanicProvider');
    }
    return context;
}
