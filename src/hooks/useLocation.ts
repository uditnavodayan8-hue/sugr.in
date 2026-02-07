'use client';
import { useState, useEffect } from 'react';
import { updateUserLocation } from '@/lib/services/profiles';
import { toast } from 'sonner';

interface LocationState {
    lat: number | null;
    lng: number | null;
    error: string | null;
}

export function useLocation() {
    const [location, setLocation] = useState<LocationState>({
        lat: null,
        lng: null,
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, error: 'Geolocation not supported' }));
            return;
        }

        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setLocation({
                lat: latitude,
                lng: longitude,
                error: null,
            });

            // Update database (fire and forget)
            updateUserLocation(latitude, longitude).catch(err =>
                console.error('Failed to sync location:', err)
            );
        };

        const handleError = (error: GeolocationPositionError) => {
            console.error('Geolocation error:', error);
            setLocation(prev => ({ ...prev, error: error.message }));
            // Don't toast on simple denial, it's annoying. Only log.
        };

        // Get initial position
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });

        // Watch for changes
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                // Throttle updates or just let it flow?
                // Supabase handles usage well, but let's be mindful. 
                // For now, raw updates are fine as clients move slowly.
                handleSuccess(position);
            },
            handleError,
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return location;
}
