'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function SettingsPage() {
    const router = useRouter();
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const settingsItems = [
        {
            section: 'Account',
            items: [
                { icon: User, label: 'Edit Profile', href: '/onboarding?mode=edit' },
                { icon: Bell, label: 'Notifications', href: '/settings/notifications' },
                { icon: Shield, label: 'Privacy & Security', href: '/settings/privacy' },
            ]
        },
        {
            section: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help & Support', href: '/settings/support' },
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold">Settings</h1>
            </header>

            <div className="p-4 space-y-8">
                {settingsItems.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest px-2">
                            {section.section}
                        </h2>
                        <div className="bg-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                            {section.items.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => router.push(item.href)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                                            <item.icon size={16} />
                                        </div>
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-white/20" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Sign Out */}
                <div className="pt-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                    <p className="text-center text-white/20 text-xs mt-4 font-mono">
                        v0.9.0 (Beta)
                    </p>
                </div>
            </div>
        </main>
    );
}
