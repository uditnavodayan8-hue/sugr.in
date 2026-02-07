'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

import { getDiscoveryProfiles, Profile, DiscoveryFilters } from '@/lib/services/profiles';
import { getSwipedProfileIds } from '@/lib/services/matches';
import { useLocation } from '@/hooks/useLocation';

export function useDiscoveryProfiles(filters: DiscoveryFilters = {}) {
    const { user } = useAuth();
    const { lat, lng } = useLocation();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const limit = filters.limit || 20;

    const loadProfiles = async (isLoadMore = false) => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Get already swiped profile IDs
            const swipedIds = await getSwipedProfileIds(user.id);

            // Fetch profiles
            const newProfiles = await getDiscoveryProfiles(user.id, {
                ...filters,
                lat: lat || undefined,
                lng: lng || undefined,
                limit,
                offset: isLoadMore ? offset : 0,
            });

            // Filter out already swiped profiles
            const filteredProfiles = newProfiles.filter(p => !swipedIds.includes(p.id));

            if (isLoadMore) {
                setProfiles(prev => [...prev, ...filteredProfiles]);
            } else {
                setProfiles(filteredProfiles);
            }

            setHasMore(newProfiles.length === limit);
            if (isLoadMore) {
                setOffset(prev => prev + limit);
            } else {
                setOffset(limit);
            }
        } catch (err) {
            console.error('Error loading profiles:', err);
            setError('Failed to load profiles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only load if location is determined OR if we want to allow fallback immediately
        // For now, let's load immediately. If location comes later, it triggers a re-fetch.
        loadProfiles();
    }, [user, filters.role, filters.city, filters.minAge, filters.maxAge, lat, lng]);

    const loadMore = () => {
        if (!loading && hasMore) {
            loadProfiles(true);
        }
    };

    const refresh = () => {
        setOffset(0);
        loadProfiles(false);
    };

    // Remove a profile from the list (after swiping)
    const removeProfile = (profileId: string) => {
        setProfiles(prev => prev.filter(p => p.id !== profileId));
    };

    return {
        profiles,
        loading,
        error,
        hasMore,
        loadMore,
        refresh,
        removeProfile,
    };
}
