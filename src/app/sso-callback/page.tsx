'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function SSOCallbackPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                <p className="text-white/50 text-sm uppercase tracking-widest">Authenticating...</p>
            </div>
            <AuthenticateWithRedirectCallback />
        </div>
    );
}
