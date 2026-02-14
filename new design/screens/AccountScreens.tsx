import React from 'react';
import { Icon } from '../components/Icon';
import { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

// --- Profile / Settings ---
export const ProfileScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="h-screen w-full bg-background-dark flex flex-col relative overflow-hidden">
        <div className="px-6 py-4 pt-12 flex items-center justify-between z-20">
            <h1 className="text-xl font-bold tracking-tight text-white">Settings</h1>
            <button onClick={() => onNavigate(Screen.BlackCard)} className="p-2 rounded-full hover:bg-white/10">
                <Icon name="qr_code_scanner" className="text-primary" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6">
            <div className="flex flex-col items-center mt-4 mb-8">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-yellow-600 rounded-full blur opacity-40"></div>
                    <div className="relative w-28 h-28 p-[3px] rounded-full bg-gradient-to-b from-primary via-yellow-400 to-yellow-700">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover rounded-full border-4 border-background-dark" />
                        <button className="absolute bottom-1 right-1 bg-primary text-black p-1.5 rounded-full border-4 border-background-dark shadow-lg">
                            <Icon name="edit" className="text-sm font-bold block" size={16} />
                        </button>
                    </div>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-white">Alexander V.</h2>
                <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Icon name="verified" className="text-sm text-primary" size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">Elite Member</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { val: "84%", label: "Completion" },
                    { val: "1.2k", label: "Likes" },
                    { val: "Gold", label: "Tier", color: "text-primary" }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark/50 border border-white/5">
                        <span className={`text-lg font-bold ${stat.color || "text-white"}`}>{stat.val}</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-1 mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-2">Account Settings</h3>
                <SettingsItem icon="person" title="Edit Profile" subtitle="Photos, bio, interests" />
                <SettingsItem icon="shield" title="Verification" subtitle="ID & Photo Check" rightElement={
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-primary font-medium">Action Needed</span>
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    </div>
                } />
                <button onClick={() => onNavigate(Screen.Premium)} className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-surface-dark to-[#2d2918] border border-primary/30 hover:border-primary/60 transition-all shadow-lg shadow-primary/5">
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
                <button onClick={() => onNavigate(Screen.Vault)} className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-dark border border-white/5 hover:bg-white/5 transition-all">
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
                <button className="text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-4">Log Out</button>
                <span className="text-xs text-gray-500">Sugr v2.4.0 (220)</span>
            </div>
        </div>
    </div>
  );
};

const SettingsItem: React.FC<any> = ({ icon, title, subtitle, rightElement }) => (
    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-dark border border-white/5 hover:bg-white/5 transition-all group">
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

// --- Premium Screen ---
export const PremiumScreen: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="h-screen w-full bg-background-dark relative flex flex-col overflow-hidden">
             {/* Ambient Background */}
            <div className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"></div>
            
            <header className="relative z-10 w-full px-6 pt-12 pb-4 flex justify-between items-center">
                <button onClick={() => onNavigate(Screen.Profile)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5">
                    <Icon name="close" className="text-white/70" />
                </button>
                <div className="text-center">
                    <span className="font-serif italic text-primary text-xl font-bold tracking-wider">Sugr</span>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50">Premium</span>
                </div>
                <button className="text-sm font-medium text-white/70 hover:text-primary">Restore</button>
            </header>

            <main className="relative z-10 flex-1 flex flex-col px-6 overflow-y-auto pb-32">
                <div className="text-center space-y-2 py-6">
                     <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-1 mb-2 border border-primary/20">
                        <Icon name="workspace_premium" className="text-primary text-sm" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">Elite Access</span>
                    </div>
                    <h1 className="font-serif text-4xl text-white leading-tight">Unlock Your <br/><span className="italic font-light text-primary/90">Privilege</span></h1>
                </div>

                <div className="space-y-6 mt-4">
                     {/* Diamond Tier */}
                    <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-primary via-white to-primary shadow-[0_0_30px_rgba(242,204,13,0.15)] transform scale-[1.02]">
                         <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-[#FFE55C] px-4 py-1 rounded-full shadow-lg">
                            <span className="text-[10px] font-bold text-black uppercase tracking-widest">Most Popular</span>
                        </div>
                        <div className="bg-background-dark rounded-2xl p-6 h-full">
                            <div className="flex justify-between items-start mb-6 mt-2">
                                <div>
                                    <h3 className="font-serif text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-white italic font-medium">Diamond</h3>
                                    <p className="text-xs text-primary/80 uppercase tracking-widest mt-1">Ultimate Luxury</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-primary">$149.99</span>
                                    <span className="text-xs text-primary/60">/mo</span>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    {icon: "diamond", text: "Concierge Service"},
                                    {icon: "visibility_off", text: "Hidden Mode"},
                                    {icon: "filter_list", text: "Exclusive Filters"}
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center space-x-3">
                                        <div className="bg-primary/20 rounded-full p-1"><Icon name={item.icon} className="text-primary text-sm" /></div>
                                        <span className="text-sm font-medium text-white">{item.text}</span>
                                    </li>
                                ))}
                                <li className="flex items-center space-x-3 opacity-80 pt-2 border-t border-white/5">
                                    <Icon name="add" className="text-primary/70" />
                                    <span className="text-xs text-white/60">Includes all Platinum benefits</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Platinum Tier */}
                    <div className="glass-panel rounded-2xl p-5 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-serif text-2xl text-white/90">Platinum</h3>
                                <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Priority</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-white">$79.99</span>
                                <span className="text-xs text-white/40">/mo</span>
                            </div>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <Icon name="check_circle" className="text-primary" />
                                <span className="text-sm text-white/80">See who likes you</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 w-full z-30 bg-gradient-to-t from-background-dark via-background-dark to-transparent pt-12 pb-8 px-6">
                <button className="w-full relative overflow-hidden rounded-xl bg-primary py-4 px-6 active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(242,204,13,0.3)]">
                    <span className="relative z-20 flex items-center justify-center space-x-2 text-black font-bold tracking-wide text-lg">
                        <span>Upgrade to Elite</span>
                        <Icon name="arrow_forward" size={20} />
                    </span>
                </button>
            </div>
        </div>
    );
};

// --- Black Card Verification ---
export const BlackCardScreen: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="h-screen w-full bg-[#1a1a1a] relative flex flex-col overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-transparent to-[#1a1a1a]"></div>
             
             <header className="flex justify-between items-center px-6 pt-12 pb-4 z-10">
                <button onClick={() => onNavigate(Screen.Profile)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10">
                    <Icon name="close" />
                </button>
                <div className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                    <span className="text-primary text-xs font-bold tracking-wider uppercase">Elite Mode</span>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 flex flex-col items-center z-10">
                <div className="text-center mb-8 mt-4">
                    <h1 className="text-2xl font-bold text-white mb-2">Unlock Legendary Status</h1>
                    <p className="text-white/50 text-sm font-medium">Verification required for Black Card access</p>
                </div>

                <div className="w-full aspect-[1.586/1] mb-12 relative group perspective-1000">
                     <div className="relative w-full h-full rounded-2xl bg-black shadow-2xl border border-white/5 overflow-hidden transform transition-transform hover:scale-[1.02]">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                         <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-9 rounded bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 relative border border-yellow-600/50"></div>
                                <Icon name="wifi" className="text-white/20 rotate-90" size={24} />
                            </div>
                            <div className="space-y-1">
                                <div className="text-transparent bg-clip-text bg-gold-gradient font-display font-extrabold text-2xl tracking-widest uppercase">
                                    Sugr <span className="font-light text-primary/80">Elite</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="font-mono text-white/40 text-xs tracking-[0.2em] pt-2">•••• •••• •••• 9021</div>
                                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Member Since 2024</div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>

                 <div className="w-full space-y-4 mb-8">
                    {[
                        { icon: "flight_takeoff", title: "Global Priority", desc: "Profile seen first worldwide" },
                        { icon: "concierge", title: "Private Concierge", desc: "24/7 dedicated support" },
                        { icon: "stars", title: "VVIP Event Access", desc: "Guaranteed invitations to galas" },
                    ].map((perk, i) => (
                         <div key={i} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Icon name={perk.icon} className="text-primary text-xl" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">{perk.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{perk.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

             <div className="p-6 bg-gradient-to-t from-background-dark to-transparent z-20">
                <button className="w-full py-4 rounded-lg bg-gradient-to-r from-[#f2cc0d] to-[#b3960a] text-black font-extrabold text-lg uppercase tracking-wide shadow-[0_0_20px_rgba(242,204,13,0.4)] flex items-center justify-center space-x-2">
                    <Icon name="verified" size={24} />
                    <span>Apply for Verification</span>
                </button>
            </div>
        </div>
    )
}

// --- Vault Screen ---
export const VaultScreen: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="h-screen w-full bg-[#0A0A0A] flex flex-col">
            <header className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-gray-800">
                <button onClick={() => onNavigate(Screen.Profile)} className="p-2 -ml-2 rounded-full text-gray-400"><Icon name="chevron_left" /></button>
                <h1 className="text-lg font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary">The Vault</h1>
                <button className="p-2 -mr-2 rounded-full text-gray-400"><Icon name="help_outline" /></button>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 border border-gray-700 shadow-[0_0_20px_rgba(115,17,212,0.4)] mb-2">
                        <Icon name="security" className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Privacy Command</h2>
                </div>

                 <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-primary rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-[#141414] border border-gray-800 p-6 rounded-2xl shadow-2xl">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Icon name="visibility_off" className="text-primary text-3xl" />
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-wide">Stealth Mode</h3>
                                        <p className="text-xs text-primary uppercase tracking-widest font-semibold">Global Override</p>
                                    </div>
                                </div>
                                <div className="w-14 h-8 bg-primary rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 bg-white w-6 h-6 rounded-full shadow-lg flex items-center justify-center">
                                        <Icon name="lock" className="text-[14px] text-black" />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-4 mt-2">
                                <p className="text-sm text-gray-300"><span className="text-primary font-semibold">Active.</span> You are invisible to non-matches.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#141414] border border-gray-800 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-3">
                            <div className="p-2 bg-gray-800 rounded-lg text-primary"><Icon name="face_retouching_natural" /></div>
                            <div>
                                <h4 className="font-bold text-white">Smart Face Blur</h4>
                                <p className="text-xs text-gray-400 mt-1">Obscure identity until matched.</p>
                            </div>
                        </div>
                        <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div></div>
                    </div>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-black mb-6 border border-white/10">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 backdrop-blur-[8px] flex items-center justify-center">
                            <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                <Icon name="visibility" className="text-white text-sm" />
                                <span className="text-xs text-white font-medium">Public View</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}