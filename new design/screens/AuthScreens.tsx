import React, { useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

// --- Splash Screen ---
export const SplashScreen: React.FC<Props> = ({ onNavigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => onNavigate(Screen.Onboarding), 2500);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-background-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
      
      <div className="z-10 flex flex-col items-center animate-fade-in-up">
        {/* Logo SVG Simulation */}
        <div className="relative mb-6">
           <svg className="drop-shadow-2xl" fill="none" height="100" viewBox="0 0 120 120" width="100" xmlns="http://www.w3.org/2000/svg">
            <path d="M78.5 32C74.5 28.5 68.5 26.5 60 26.5C44 26.5 34 35.5 34 49.5C34 61.5 42.5 67 52.5 70.5L58 72.5C65.5 75 69 77.5 69 83C69 88.5 64 92 57.5 92C49 92 42 87.5 38.5 82" stroke="url(#paint0_linear)" strokeLinecap="round" strokeWidth="6"></path>
            <path d="M42 93C46.5 96 52 97.5 58 97.5C76 97.5 86 88 86 72.5C86 60 76.5 54.5 67 51L62 49C54 46.5 51 44.5 51 38.5C51 33.5 55 30.5 60.5 30.5C66.5 30.5 72 33.5 75 37" stroke="url(#paint1_linear)" strokeLinecap="round" strokeWidth="6"></path>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="34" x2="80" y1="26.5" y2="92">
                <stop offset="0%" stopColor="#f2cc0d"></stop>
                <stop offset="100%" stopColor="#bf9b30"></stop>
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear" x1="40" x2="86" y1="30" y2="97.5">
                <stop offset="0%" stopColor="#bf9b30"></stop>
                <stop offset="100%" stopColor="#f2cc0d"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="text-4xl tracking-[0.2em] font-serif font-medium text-transparent bg-clip-text bg-gold-text">SUGR</h1>
        
        <div className="mt-8 flex flex-col items-center space-y-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          <p className="text-gold-light/90 font-serif text-lg tracking-wide italic font-light text-center max-w-xs leading-relaxed">
             Where Ambition<br/>Meets Generosity
          </p>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center">
        <div className="relative h-0.5 w-32 bg-white/10 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-primary w-1/3 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <style>{`@keyframes loading { 0% { left: -35%; } 50% { left: 100%; } 100% { left: 100%; } }`}</style>
      </div>
    </div>
  );
};

// --- Onboarding Screen ---
export const OnboardingScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative h-screen w-full bg-background-dark">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop" 
          alt="Couple" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-12">
        <div className="absolute top-12 left-0 right-0 flex justify-center opacity-90">
            <div className="text-primary font-serif italic text-2xl tracking-widest font-bold">Sugr</div>
        </div>

        <div className="glass-panel rounded-2xl p-8 border border-white/10 animate-fade-in-up">
           <h1 className="font-serif text-4xl leading-tight text-white drop-shadow-sm mb-4">
              Meet people who <span className="italic text-primary">invest</span> in your lifestyle
          </h1>
          <p className="font-sans text-white/80 text-lg font-light leading-relaxed mb-6">
              Join an exclusive community where ambition meets romance. Experience dating without compromise.
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-2">
              <div className="w-8 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(242,204,13,0.5)]"></div>
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
            </div>
            <button 
              onClick={() => onNavigate(Screen.RoleSelection)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-black hover:bg-white transition-colors shadow-[0_4px_14px_rgba(242,204,13,0.4)]"
            >
              <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Role Selection Screen ---
export const RoleSelectionScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="h-screen w-full bg-background-dark flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <header className="flex items-center justify-between px-6 pt-12 pb-4 z-10">
        <button onClick={() => onNavigate(Screen.Onboarding)} className="text-gray-500 hover:text-primary transition-colors">
          <Icon name="arrow_back" />
        </button>
        <div className="text-xl font-bold tracking-widest text-primary uppercase">Sugr</div>
        <div className="w-6"></div>
      </header>

      <main className="flex-1 flex flex-col px-6 z-10">
        <div className="w-full flex justify-center space-x-2 mb-12 mt-4">
            <div className="h-1 w-8 rounded-full bg-gray-700"></div>
            <div className="h-1 w-8 rounded-full bg-gray-700"></div>
            <div className="h-1 w-8 rounded-full bg-primary shadow-[0_0_10px_rgba(242,204,13,0.5)]"></div>
        </div>

        <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold text-white mb-3">Define your status</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
                Select your role to begin your exclusive journey.
            </p>
        </div>

        <div className="flex flex-col gap-6 flex-1 pb-10">
           <button 
              onClick={() => onNavigate(Screen.Discovery)}
              className="group relative w-full text-left transition-all duration-300 transform hover:scale-[1.02]"
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl blur-[1px] group-hover:from-primary group-hover:to-primary/50 transition duration-500 opacity-70 group-hover:opacity-100"></div>
                <div className="relative bg-surface-dark rounded-xl p-6 h-32 flex items-center justify-between border border-gray-800 group-hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                             <Icon name="diamond" className="text-gray-300 group-hover:text-primary text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">I am a Benefactor</h3>
                            <p className="text-sm text-gray-400 mt-1">Generous & Established</p>
                        </div>
                    </div>
                    <div className="h-6 w-6 rounded-full border-2 border-gray-600 group-hover:border-primary flex items-center justify-center">
                       <div className="h-2.5 w-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
           </button>

           <button 
              onClick={() => onNavigate(Screen.Discovery)}
              className="group relative w-full text-left transition-all duration-300 transform hover:scale-[1.02]"
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl blur-[1px] group-hover:from-primary group-hover:to-primary/50 transition duration-500 opacity-70 group-hover:opacity-100"></div>
                <div className="relative bg-surface-dark rounded-xl p-6 h-32 flex items-center justify-between border border-gray-800 group-hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                             <Icon name="star" className="text-gray-300 group-hover:text-primary text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">I am a Companion</h3>
                            <p className="text-sm text-gray-400 mt-1">Ambitious & Attractive</p>
                        </div>
                    </div>
                    <div className="h-6 w-6 rounded-full border-2 border-gray-600 group-hover:border-primary flex items-center justify-center">
                       <div className="h-2.5 w-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
           </button>
        </div>
        
        <div className="mb-10 text-center opacity-60">
            <p className="text-xs text-gray-400">By continuing, you agree to our Terms of Service.</p>
        </div>
      </main>
    </div>
  );
};