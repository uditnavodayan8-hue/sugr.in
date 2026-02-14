import React, { useState } from 'react';
import { Screen } from './types';
import { SplashScreen, OnboardingScreen, RoleSelectionScreen } from './screens/AuthScreens';
import { DiscoveryScreen, MatchRevealScreen } from './screens/Discovery';
import { BoardScreen, ChatListScreen, ChatDetailScreen, GiftsScreen, VideoCallScreen } from './screens/SocialScreens';
import { ProfileScreen, PremiumScreen, BlackCardScreen, VaultScreen } from './screens/AccountScreens';
import { ProfileDetailScreen } from './screens/ProfileDetailScreen';
import { BottomNav } from './components/BottomNav';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Splash:
        return <SplashScreen onNavigate={navigate} />;
      case Screen.Onboarding:
        return <OnboardingScreen onNavigate={navigate} />;
      case Screen.RoleSelection:
        return <RoleSelectionScreen onNavigate={navigate} />;
      case Screen.Discovery:
        return <DiscoveryScreen onNavigate={navigate} />;
      case Screen.MatchReveal:
        return <MatchRevealScreen onNavigate={navigate} />;
      case Screen.ProfileDetail:
        return <ProfileDetailScreen onNavigate={navigate} />;
      case Screen.Board:
        return <BoardScreen onNavigate={navigate} />;
      case Screen.ChatList:
        return <ChatListScreen onNavigate={navigate} />;
      case Screen.ChatDetail:
        return <ChatDetailScreen onNavigate={navigate} />;
      case Screen.VideoCall:
        return <VideoCallScreen onNavigate={navigate} />;
      case Screen.Gifts:
        return <GiftsScreen onNavigate={navigate} />;
      case Screen.Profile:
        return <ProfileScreen onNavigate={navigate} />;
      case Screen.Premium:
        return <PremiumScreen onNavigate={navigate} />;
      case Screen.BlackCard:
        return <BlackCardScreen onNavigate={navigate} />;
      case Screen.Vault:
        return <VaultScreen onNavigate={navigate} />;
      default:
        return <DiscoveryScreen onNavigate={navigate} />;
    }
  };

  // Determine if we should show the bottom nav
  const showBottomNav = [
    Screen.Discovery,
    Screen.Board,
    Screen.ChatList,
    Screen.Profile,
  ].includes(currentScreen);

  return (
    <div className="antialiased text-gray-100 font-sans min-h-screen bg-background-dark flex justify-center">
      <div className="w-full max-w-md relative bg-background-dark shadow-2xl min-h-screen">
        {renderScreen()}
        {showBottomNav && (
          <BottomNav currentScreen={currentScreen} onNavigate={navigate} />
        )}
      </div>
    </div>
  );
};

export default App;