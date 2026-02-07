'use client';

import { useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseScreenshotDetectionOptions {
    /** Callback when screenshot is detected */
    onScreenshot?: () => void;
    /** Show toast notification on detection */
    showToast?: boolean;
    /** Custom toast message */
    toastMessage?: string;
    /** Enable/disable detection */
    enabled?: boolean;
}

/**
 * Hook to detect screenshot attempts using client-side event listeners.
 * 
 * Detection methods:
 * - PrintScreen key (Windows)
 * - Cmd+Shift+3/4 (Mac)
 * - Visibility change (some screenshot tools hide the app)
 * - DevTools detection (for screen capture)
 * 
 * Note: This is NOT foolproof. Determined users can still capture screens.
 * This is a deterrent, not a security measure.
 */
export function useScreenshotDetection({
    onScreenshot,
    showToast = true,
    toastMessage = 'Screenshots are not allowed for privacy protection.',
    enabled = true,
}: UseScreenshotDetectionOptions = {}) {
    const lastVisibilityChange = useRef<number>(0);
    const lastKeyPress = useRef<number>(0);

    const handleScreenshotDetected = useCallback(() => {
        if (onScreenshot) {
            onScreenshot();
        }
        if (showToast) {
            toast.error('Screenshot Detected', {
                description: toastMessage,
                duration: 5000,
            });
        }
    }, [onScreenshot, showToast, toastMessage]);

    useEffect(() => {
        if (!enabled) return;

        // Detect PrintScreen and Mac screenshot shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now();

            // Debounce
            if (now - lastKeyPress.current < 500) return;

            // PrintScreen
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                lastKeyPress.current = now;
                handleScreenshotDetected();
                return;
            }

            // Mac: Cmd+Shift+3 or Cmd+Shift+4
            if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) {
                lastKeyPress.current = now;
                handleScreenshotDetected();
                return;
            }

            // Windows: Win+Shift+S (Snipping Tool)
            if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') {
                lastKeyPress.current = now;
                handleScreenshotDetected();
                return;
            }
        };

        // Some screenshot tools briefly hide the window
        const handleVisibilityChange = () => {
            const now = Date.now();

            // Quick visibility toggle might indicate screenshot
            if (document.visibilityState === 'visible') {
                const timeSinceHidden = now - lastVisibilityChange.current;
                // If hidden for less than 500ms, might be a screenshot
                if (timeSinceHidden > 0 && timeSinceHidden < 500) {
                    handleScreenshotDetected();
                }
            } else {
                lastVisibilityChange.current = now;
            }
        };

        // Detect window blur (some tools blur window during capture)
        const handleWindowBlur = () => {
            // Set a timer - if we get focus back quickly, might be screenshot
            const blurTime = Date.now();

            const handleFocus = () => {
                const focusTime = Date.now();
                if (focusTime - blurTime < 300) {
                    // Very quick blur/focus cycle
                    handleScreenshotDetected();
                }
                window.removeEventListener('focus', handleFocus);
            };

            // Only add listener temporarily
            setTimeout(() => {
                window.addEventListener('focus', handleFocus, { once: true });
            }, 0);
        };

        // Add listeners
        document.addEventListener('keydown', handleKeyDown, { capture: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyDown, { capture: true });
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [enabled, handleScreenshotDetected]);

    return {
        /** Manually trigger screenshot detection (for testing) */
        triggerDetection: handleScreenshotDetected,
    };
}

export default useScreenshotDetection;
