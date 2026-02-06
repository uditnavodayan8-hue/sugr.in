'use client';
import { useEffect, useState, useCallback } from 'react';

interface UseScreenshotGuardOptions {
    enabled?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
}

export function useScreenshotGuard(options: UseScreenshotGuardOptions = {}) {
    const { enabled = true, onBlur, onFocus } = options;
    const [isBlurred, setIsBlurred] = useState(false);

    // Detect window blur (user switching apps/tabs)
    useEffect(() => {
        if (!enabled) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsBlurred(true);
                onBlur?.();
            } else {
                setIsBlurred(false);
                onFocus?.();
            }
        };

        const handleBlur = () => {
            setIsBlurred(true);
            onBlur?.();
        };

        const handleFocus = () => {
            setIsBlurred(false);
            onFocus?.();
        };

        // Listen to visibility changes (tab switch)
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Listen to window focus/blur
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [enabled, onBlur, onFocus]);

    // Attempt to detect Print Screen (limited effectiveness)
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // PrintScreen key
            if (e.key === 'PrintScreen') {
                setIsBlurred(true);
                // Flash blur effect
                setTimeout(() => setIsBlurred(false), 500);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [enabled]);

    // CSS styles to discourage screenshots
    const guardStyles = {
        userSelect: 'none' as const,
        WebkitUserSelect: 'none' as const,
        MozUserSelect: 'none' as const,
        msUserSelect: 'none' as const,
        WebkitTouchCallout: 'none' as const,
    };

    return {
        isBlurred,
        guardStyles,
        setIsBlurred,
    };
}

export default useScreenshotGuard;
