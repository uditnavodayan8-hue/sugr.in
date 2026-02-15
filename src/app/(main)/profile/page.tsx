"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useSugr } from '@/context/SugrContext';

const SettingsItem: React.FC<any> = ({ icon, title, subtitle, rightElement, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-dark border border-white/5 hover:bg-white/5 transition-all group">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors text-primary">
                <Icon name={icon} />
            </div>
            <div className="text-left">
                <span className="block font-medium text-white">{title}</span>
                {subtitle && <span className="block text-xs text-gray-400">{subtitle}</span>}
            </div>
        </div>
        <div className="flex items-center gap-2">
            {rightElement}
            <Icon name="chevron_right" className="text-gray-400" />
        </div>
    </button>
);

export default function ProfilePage() {
    const router = useRouter();
    const { profile, signOut } = useSugr();

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
                <div className="animate-pulse">Loading Profile...</div>
            </div>
        );
    }

    // Interactive Stats (Mocked for now until backend supports them)
    const completion = profile.photos && profile.photos.length >= 3 ? "100%" : "60%";
    const likes = "0"; // Placeholder
    const tier = profile.lifestyle_tier ? profile.lifestyle_tier.charAt(0).toUpperCase() + profile.lifestyle_tier.slice(1) : "Explorer";
    const tierColor = profile.lifestyle_tier === 'elite' ? 'text-primary' : 'text-gray-400';

    return (
        <div className="min-h-screen w-full bg-background-dark flex flex-col relative overflow-hidden">
            <div className="px-6 py-4 pt-12 flex items-center justify-between z-20">
                <h1 className="text-xl font-bold tracking-tight text-white">Settings</h1>
                <button onClick={() => router.push('/black-card')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Icon name="qr_code_scanner" className="text-primary" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6">
                <div className="flex flex-col items-center mt-4 mb-8">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-yellow-600 rounded-full blur opacity-40 animate-pulse-slow"></div>
                        <div className="relative w-28 h-28 p-[3px] rounded-full bg-gradient-to-b from-primary via-yellow-400 to-yellow-700">
                            <img
                                src={profile.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                className="w-full h-full object-cover rounded-full border-4 border-background-dark bg-zinc-800"
                                alt="Profile"
                            />
                            <button className="absolute bottom-1 right-1 bg-primary text-black p-1.5 rounded-full border-4 border-background-dark shadow-lg hover:scale-110 transition-transform">
                                <Icon name="edit" className="text-sm font-bold block" size={16} />
                            </button>
                        </div>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-white text-center">{profile.name || "Anonymous User"}</h2>

                    {profile.role && (
                        <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            {profile.is_verified && <Icon name="verified" className="text-sm text-primary" size={16} />}
                            <span className="text-xs font-semibold uppercase tracking-wide text-primary">{profile.role}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { val: completion, label: "Completion" },
                        { val: likes, label: "Likes" },
                        { val: tier, label: "Tier", color: tierColor }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark/50 border border-white/5 hover:border-white/10 transition-colors">
                            <span className={`text-lg font-bold ${stat.color || "text-white"}`}>{stat.val}</span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-1 mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-2">Account Settings</h3>
                    <SettingsItem
                        icon="person"
                        title="Edit Profile"
                        subtitle="Photos, bio, interests"
                        onClick={() => router.push('/onboarding')}
                    />
                    <SettingsItem icon="shield" title="Verification" subtitle="ID & Photo Check" rightElement={
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-primary font-medium">Action Needed</span>
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        </div>
                    } />
                    <button onClick={() => router.push('/premium')} className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-surface-dark to-[#2d2918] border border-primary/30 hover:border-primary/60 transition-all shadow-lg shadow-primary/5 active:scale-[0.98]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-black shadow-lg shadow-primary/20">
                                <Icon name="diamond" />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-primary">Sugr Gold</span>
                                <span className="block text-xs text-gray-400">Manage Subscription</span>
                            </div>
                        </div>
                        <Icon name="chevron_right" className="text-primary/70" />
                    </button>
                    <button onClick={() => router.push('/vault')} className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-dark border border-white/5 hover:bg-white/5 transition-all active:scale-[0.98]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-900/40 flex items-center justify-center text-purple-400">
                                <Icon name="lock" />
                            </div>
                            <div className="text-left">
                                <span className="block font-medium text-white">The Vault</span>
                                <span className="block text-xs text-gray-400">Privacy Control</span>
                            </div>
                        </div>
                        <Icon name="chevron_right" className="text-gray-400" />
                    </button>
                </div>

                <div className="flex flex-col items-center pb-8">
                    <button
                        onClick={() => signOut()}
                        className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors mb-4"
                    >
                        Log Out
                    </button>
                    <span className="text-xs text-gray-500">Sugr v2.4.1 (Live)</span>
                </div>
            </div>
        </div>
    );
}

