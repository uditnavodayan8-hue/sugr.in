'use client';

import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Construction } from 'lucide-react';

export default function SettingsSubPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const title = slug.charAt(0).toUpperCase() + slug.slice(1);

    return (
        <main className="min-h-screen bg-black text-white p-6 flex flex-col">
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">{title} Settings</h1>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <Construction size={48} className="text-white/20" />
                <div>
                    <h2 className="text-lg font-bold">Coming Soon</h2>
                    <p className="text-sm text-white/50">This feature is under development.</p>
                </div>
            </div>
        </main>
    );
}
