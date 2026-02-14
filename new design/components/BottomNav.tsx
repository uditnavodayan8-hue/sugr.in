import React from 'react';
import { Icon } from './Icon';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const getIconColor = (screen: Screen) => {
    // Logic to highlight current tab
    const isActive = currentScreen === screen || 
      (screen === Screen.Discovery && currentScreen === Screen.ProfileDetail) ||
      (screen === Screen.ChatList && currentScreen === Screen.ChatDetail);
      
    return isActive ? "text-primary" : "text-gray-500 hover:text-gray-300";
  };

  return (
    <nav className="fixed bottom-0 w-full bg-surface-dark/95 backdrop-blur-xl border-t border-white/5 pb-safe pt-2 z-50">
      <div className="flex justify-around items-center px-2 h-16">
        <button 
          onClick={() => onNavigate(Screen.Discovery)}
          className={`flex flex-col items-center gap-1 w-16 group ${getIconColor(Screen.Discovery)}`}
        >
          <div className="relative">
            <Icon name="style" className="text-2xl transition-all" filled={currentScreen === Screen.Discovery} />
            {currentScreen === Screen.Discovery && (
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#f2cc0d]"></span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Discover</span>
        </button>

        <button 
          onClick={() => onNavigate(Screen.Board)}
          className={`flex flex-col items-center gap-1 w-16 group ${getIconColor(Screen.Board)}`}
        >
          <Icon name="dashboard" className="text-2xl transition-all" filled={currentScreen === Screen.Board} />
          <span className="text-[10px] font-medium mt-1">Board</span>
        </button>

        <button 
          onClick={() => onNavigate(Screen.ChatList)}
          className={`flex flex-col items-center gap-1 w-16 group ${getIconColor(Screen.ChatList)}`}
        >
          <div className="relative">
            <Icon name="chat_bubble" className="text-2xl transition-all" filled={currentScreen === Screen.ChatList} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-background-dark"></span>
          </div>
          <span className="text-[10px] font-medium mt-1">Chats</span>
        </button>

        <button 
          onClick={() => onNavigate(Screen.Profile)}
          className={`flex flex-col items-center gap-1 w-16 group ${getIconColor(Screen.Profile)}`}
        >
          <Icon name="person" className="text-2xl transition-all" filled={currentScreen === Screen.Profile} />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};