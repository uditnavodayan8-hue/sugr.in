'use client';
import { Suspense } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    return (
        <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-sm text-center">
                <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} className="text-red-500" />
                </div>

                <h1 className="text-xl font-serif text-[#F7E7CE] mb-2 tracking-wide">Authentication Failed</h1>

                <p className="text-zinc-400 text-sm mb-6">
                    {errorDescription || error || 'The link may have expired or is invalid.'}
                </p>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full py-3 bg-[#F7E7CE] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
            <AuthErrorContent />
        </Suspense>
    );
}
