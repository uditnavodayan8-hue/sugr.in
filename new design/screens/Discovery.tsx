import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

// --- Discovery Feed ---
export const DiscoveryScreen: React.FC<Props> = ({ onNavigate }) => {
  const [showFilters, setShowFilters] = useState(false);

  if (showFilters) return <FiltersView onClose={() => setShowFilters(false)} />;

  return (
    <div className="relative h-screen w-full bg-background-dark flex flex-col overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-40 px-6 pt-12 pb-2 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => setShowFilters(true)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
           <Icon name="tune" className="text-gray-300" />
        </button>
        <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center">
                <span className="text-primary text-xs font-bold font-serif">S</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary font-serif">SUGR</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-white/10 relative">
           <Icon name="notifications" className="text-gray-300" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#f2cc0d]"></span>
        </button>
      </header>

      <main className="flex-1 relative flex flex-col justify-center items-center px-4 pt-16 pb-20">
         {/* Background Cards for stack effect */}
        <div className="absolute w-[90%] h-[75%] bg-surface-dark rounded-3xl opacity-40 transform scale-95 translate-y-8 shadow-xl border border-white/5 z-0"></div>
        <div className="absolute w-[95%] h-[75%] bg-surface-dark rounded-3xl opacity-60 transform scale-[0.97] translate-y-4 shadow-xl border border-white/5 z-10"></div>
        
        {/* Main Card */}
        <div 
          onClick={() => onNavigate(Screen.ProfileDetail)}
          className="relative w-full h-[75%] z-20 group cursor-pointer rounded-3xl p-[1px] bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#aa771c] shadow-[0_0_30px_rgba(191,149,63,0.15)]"
        >
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black">
                <img 
                    src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1000&auto=format&fit=crop" 
                    alt="Anastasia" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>
                
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex gap-1">
                        <span className="h-1 w-8 bg-white/90 rounded-full shadow-lg"></span>
                        <span className="h-1 w-8 bg-white/30 rounded-full shadow-lg"></span>
                        <span className="h-1 w-8 bg-white/30 rounded-full shadow-lg"></span>
                    </div>
                    <div className="px-3 py-1 glass-panel rounded-full flex items-center gap-1 border border-primary/20 shadow-lg">
                        <Icon name="verified" className="text-primary text-[14px]" />
                        <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Gold</span>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 glass-panel border-t-0 border-x-0 border-b-0 backdrop-blur-xl rounded-b-3xl">
                     <div className="px-5 pt-5 pb-5">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-3xl font-bold text-white drop-shadow-md font-serif tracking-wide">Anastasia</h2>
                                    <span className="text-xl font-normal text-gray-200 font-serif">24</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <div className="flex items-center gap-1 text-gold-light/80">
                                        <Icon name="location_on" className="text-sm" />
                                        <span className="text-sm font-serif italic tracking-wide">Bandra, 2km</span>
                                    </div>
                                     <div className="w-px h-3 bg-white/20"></div>
                                     <div className="flex items-center gap-1 text-gold-light/80">
                                        <Icon name="auto_awesome" className="text-sm" />
                                        <span className="text-sm font-serif italic tracking-wide">94% Match</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-primary/30 backdrop-blur-md">
                                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Muse</span>
                            </div>
                        </div>
                        
                         <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent my-3"></div>
                         
                         <div className="flex flex-wrap gap-2">
                            {["Travel", "Dining", "Luxury"].map(tag => (
                                <div key={tag} className="px-3 py-1.5 rounded-full bg-black/30 border border-white/5 flex items-center gap-1.5">
                                    <Icon name={tag === "Travel" ? "flight" : tag === "Dining" ? "wine_bar" : "payments"} className="text-primary text-sm" />
                                    <span className="text-xs font-medium text-gray-200">{tag}</span>
                                </div>
                            ))}
                         </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-30 pb-24">
            <button className="w-16 h-16 rounded-full bg-matte-black border border-white/5 shadow-lg flex items-center justify-center group active:scale-95 transition-all">
                <Icon name="close" className="text-3xl text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <button 
                onClick={() => onNavigate(Screen.MatchReveal)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-[0_0_20px_rgba(242,204,13,0.4)] flex items-center justify-center transform -translate-y-6 group active:scale-95 transition-all border-2 border-white/20"
            >
                <Icon name="star" className="text-3xl text-white drop-shadow-md" />
            </button>
            <button className="w-16 h-16 rounded-full bg-primary/10 border border-primary/50 shadow-[0_0_20px_rgba(242,204,13,0.4)] flex items-center justify-center group active:scale-95 transition-all backdrop-blur-sm">
                 <Icon name="favorite" className="text-3xl text-primary drop-shadow-[0_0_8px_rgba(242,204,13,0.8)]" filled />
            </button>
        </div>
      </main>
    </div>
  );
};

// --- Filters View ---
const FiltersView: React.FC<{onClose: () => void}> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-background-dark flex flex-col">
            <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full">
                    <Icon name="close" className="text-white" />
                </button>
                <h1 className="text-lg font-bold tracking-wide">Filters</h1>
                <button className="text-sm font-medium text-primary">Reset</button>
            </header>
            
            <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                 <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary/80">Demographics</h2>
                        <span className="text-lg font-medium text-white">24 - 45</span>
                    </div>
                    <input type="range" className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    <p className="text-xs text-gray-400">Search for profiles within this age range.</p>
                </section>

                <section className="space-y-4">
                     <div className="flex justify-between items-end">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary/80">Lifestyle Expectation</h2>
                        <span className="text-lg font-medium text-white">$2k - $8k+</span>
                    </div>
                     <input type="range" className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                     <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>$1k</span>
                        <span>$10k+</span>
                    </div>
                </section>

                <div className="h-px w-full bg-white/5"></div>

                 <section className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                        <span className="text-base font-medium text-white">Verified Profiles Only</span>
                        <span className="text-xs text-gray-400 mt-1">Show only users with ID verification</span>
                    </div>
                     <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                     </div>
                </section>
                
                 <div className="h-px w-full bg-white/5"></div>

                 <section className="space-y-4">
                     <h2 className="text-sm font-semibold uppercase tracking-wider text-primary/80">Looking For</h2>
                     <div className="flex flex-wrap gap-3">
                         {["Mentorship", "Travel", "Networking", "Romance", "Discreet"].map((tag, i) => (
                             <button key={tag} className={`px-4 py-2 rounded-full text-sm font-semibold transition-transform active:scale-95 ${i % 3 === 0 ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                                 {tag}
                             </button>
                         ))}
                     </div>
                 </section>
            </main>
            
             <div className="p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-20">
                <button onClick={onClose} className="w-full bg-primary text-black font-bold py-4 px-6 rounded-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                    Apply Filters
                    <Icon name="arrow_forward" className="text-lg group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}

// --- Match Reveal ---
export const MatchRevealScreen: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="absolute inset-0 z-50 bg-background-dark flex flex-col items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none"></div>
             
             {/* Confetti (Simple CSS representation) */}
             {[...Array(6)].map((_, i) => (
                 <div key={i} className="absolute w-2 h-2 bg-primary opacity-60 rounded-sm" style={{
                     top: `${Math.random() * 50}%`,
                     left: `${Math.random() * 100}%`,
                     transform: `rotate(${Math.random() * 360}deg)`
                 }}></div>
             ))}

            <nav className="absolute top-0 w-full px-6 pt-12 pb-4 flex justify-end">
                <button onClick={() => onNavigate(Screen.Discovery)} className="text-white/60 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-sm font-medium tracking-wide uppercase">Keep Browsing</span>
                    <Icon name="close" />
                </button>
            </nav>

            <div className="text-center mb-10 space-y-2 z-10 px-6">
                <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gold-text drop-shadow-sm">It's a Golden Match</h1>
                <div className="h-0.5 w-16 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"></div>
            </div>

            <div className="relative w-full h-48 flex justify-center items-center mb-12">
                 {/* User A */}
                 <div className="absolute left-1/2 -translate-x-[85%] z-10 transform hover:scale-105 transition-transform duration-500">
                    <div className="bg-gradient-to-br from-[#b09304] via-[#f9e47e] to-[#f2cc0d] rounded-full p-[3px] shadow-2xl">
                        <div className="bg-black rounded-full p-[2px]">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" className="w-32 h-32 rounded-full object-cover" />
                        </div>
                    </div>
                 </div>

                 {/* Heart Icon */}
                 <div className="absolute left-1/2 -translate-x-1/2 z-30">
                    <div className="bg-primary rounded-full p-2 shadow-lg shadow-primary/20 border-4 border-background-dark">
                        <Icon name="favorite" className="text-background-dark text-xl" filled />
                    </div>
                </div>

                 {/* User B */}
                 <div className="absolute right-1/2 translate-x-[85%] z-20 transform hover:scale-105 transition-transform duration-500">
                     <div className="bg-gradient-to-br from-[#b09304] via-[#f9e47e] to-[#f2cc0d] rounded-full p-[3px] shadow-2xl">
                        <div className="bg-black rounded-full p-[2px]">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" className="w-32 h-32 rounded-full object-cover" />
                        </div>
                    </div>
                 </div>
            </div>

            <div className="text-center space-y-3 mb-12 z-10 px-6">
                <h2 className="text-2xl text-[#eaddcf] font-serif italic">Ambition Meets Generosity</h2>
                <p className="text-white/60 text-sm font-light tracking-wide max-w-xs mx-auto">You and <span className="text-primary font-medium">Elena</span> have sparked a connection worthy of attention.</p>
            </div>

            <div className="w-full max-w-xs space-y-4 z-10">
                <button 
                  onClick={() => onNavigate(Screen.Gifts)}
                  className="w-full relative overflow-hidden rounded-lg bg-gradient-to-r from-[#f2cc0d] via-[#f9e47e] to-[#b09304] p-[1px]"
                >
                    <div className="relative flex items-center justify-center gap-3 bg-gradient-to-b from-primary to-[#d4b005] px-6 py-4 hover:brightness-110 transition-all">
                        <Icon name="card_giftcard" className="text-background-dark" />
                        <span className="font-bold text-background-dark text-sm tracking-wide uppercase">Send a Premium Gift</span>
                    </div>
                </button>
                <button 
                  onClick={() => onNavigate(Screen.ChatDetail)}
                  className="w-full rounded-lg border border-primary/40 bg-background-dark/50 px-6 py-4 hover:bg-primary/10 transition-all backdrop-blur-sm flex items-center justify-center gap-3"
                >
                    <Icon name="chat_bubble_outline" className="text-primary text-sm" />
                    <span className="font-medium text-primary tracking-wide text-sm uppercase">Start a Private Chat</span>
                </button>
            </div>
        </div>
    )
}