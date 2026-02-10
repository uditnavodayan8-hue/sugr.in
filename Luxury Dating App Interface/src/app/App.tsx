import { useState } from 'react';
import { VideoBackground } from './components/VideoBackground';
import { SwipeCard, Profile } from './components/SwipeCard';
import { MatchPopup } from './components/MatchPopup';
import { TripsFeed, TripPost } from './components/TripsFeed';
import { Heart, Flame, MessageCircle, User, Plus, Search, Filter, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Mock data
const profiles: Profile[] = [
  {
    id: 1,
    name: "Sophia",
    age: 23,
    location: "Mumbai",
    occupation: "Model & Influencer",
    imageUrl: "https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3BoaXN0aWNhdGVkJTIwd29tYW4lMjBsdXh1cnl8ZW58MXx8fHwxNzcwNzQyMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3BoaXN0aWNhdGVkJTIwd29tYW4lMjBsdXh1cnl8ZW58MXx8fHwxNzcwNzQyMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1619384846683-8dede3452564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbW9kZWwlMjBmYXNoaW9ufGVufDF8fHx8MTc3MDc0MjExMXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    bio: "Seeking a generous gentleman who appreciates the finer things. I enjoy luxury travel, fine dining, and sophisticated company.",
    verified: true,
    role: 'sugar-baby',
    allowanceRange: '₹50k-100k/mo',
    lookingFor: 'Generous, Sophisticated, Well-traveled',
    lifestyle: ['Travel', 'Fine Dining', 'Fashion', 'Yoga', 'Art Galleries'],
    height: '5\'7"',
    instagram: '@sophia_luxury',
  },
  {
    id: 2,
    name: "Priya",
    age: 25,
    location: "Delhi",
    occupation: "Entrepreneur",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBmYXNoaW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwNzQxNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Looking for someone who can match my ambition and lifestyle. Let's explore the world together in style.",
    verified: true,
    role: 'sugar-baby',
    allowanceRange: '₹75k-150k/mo',
    lookingFor: 'Successful, Ambitious, Generous',
    lifestyle: ['Luxury Travel', 'Wine Tasting', 'Shopping', 'Spa', 'Beach Resorts'],
    height: '5\'5"',
  },
  {
    id: 3,
    name: "Arjun",
    age: 38,
    location: "Bangalore",
    occupation: "Tech CEO",
    imageUrl: "https://images.unsplash.com/photo-1522255272218-7ac5249be344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWFsdGh5JTIwYnVzaW5lc3NtYW4lMjBsdXh1cnklMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzcwNzQyMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Successful entrepreneur looking for an intelligent, beautiful companion to share my lifestyle with. I value discretion and sophistication.",
    verified: true,
    role: 'sugar-daddy',
    allowanceRange: '₹100k-200k/mo',
    lookingFor: 'Beautiful, Intelligent, Discreet',
    lifestyle: ['Fine Dining', 'Yachting', 'Golf', 'Wine Collection', 'Private Jets'],
    height: '6\'1"',
  },
];

const tripPosts: TripPost[] = [
  {
    id: 1,
    userId: 1,
    userName: "Ananya",
    userAge: 24,
    userImage: "https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3BoaXN0aWNhdGVkJTIwd29tYW4lMjBsdXh1cnl8ZW58MXx8fHwxNzcwNzQyMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    verified: true,
    location: "Delhi",
    duration: "2 days",
    startDate: "Feb 12-14",
    allowance: "₹20,000",
    description: "I'm in Delhi for 2 days for work. Looking for a generous companion to show me around and enjoy fine dining. Professional, discreet, and fun!",
    postedAgo: "2 hours ago",
    role: 'sugar-baby',
  },
  {
    id: 2,
    userId: 2,
    userName: "Kavya",
    userAge: 22,
    userImage: "https://images.unsplash.com/photo-1619384846683-8dede3452564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbW9kZWwlMjBmYXNoaW9ufGVufDF8fHx8MTc3MDc0MjExMXww&ixlib=rb-4.1.0&q=80&w=1080",
    verified: true,
    location: "Goa",
    duration: "1 week",
    startDate: "Feb 15-22",
    allowance: "₹75,000",
    description: "Planning a luxury beach vacation in Goa. Seeking a sophisticated gentleman to join me for sun, luxury resorts, and amazing experiences.",
    postedAgo: "5 hours ago",
    role: 'sugar-baby',
  },
  {
    id: 3,
    userId: 3,
    userName: "Rajesh",
    userAge: 42,
    userImage: "https://images.unsplash.com/photo-1522255272218-7ac5249be344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWFsdGh5JTIwYnVzaW5lc3NtYW4lMjBsdXh1cnklMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzcwNzQyMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    verified: true,
    location: "Dubai",
    duration: "3 days",
    startDate: "Feb 18-21",
    allowance: "₹150,000",
    description: "Business trip to Dubai. Looking for an elegant companion to join me. 5-star accommodations, fine dining, and generous allowance included.",
    postedAgo: "1 day ago",
    role: 'sugar-daddy',
  },
  {
    id: 4,
    userId: 4,
    userName: "Isha",
    userAge: 26,
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBmYXNoaW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwNzQxNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    verified: true,
    location: "Mumbai",
    duration: "Weekend",
    startDate: "This weekend",
    allowance: "₹35,000",
    description: "Free this weekend in Mumbai. Looking for someone to spoil me with shopping, spa day, and luxury dining. Let's make it memorable!",
    postedAgo: "3 hours ago",
    role: 'sugar-baby',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'discover' | 'trips' | 'matches' | 'messages' | 'profile'>('discover');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Profile[]>([]);

  const currentUser = {
    name: "You",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentProfileIndex];
    
    if (direction === 'right') {
      setLikedProfiles([...likedProfiles, currentProfile.id]);
      
      // Simulate match (50% chance)
      if (Math.random() > 0.5) {
        setMatchedProfile(currentProfile);
        setMatches([...matches, currentProfile]);
      }
    }

    // Move to next profile
    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
    }, 300);
  };

  const handleManualAction = (action: 'pass' | 'like') => {
    handleSwipe(action === 'like' ? 'right' : 'left');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <VideoBackground 
        fallbackImage="https://images.unsplash.com/photo-1672055290450-0fbc026c5b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMG5pZ2h0JTIwY2l0eXxlbnwxfHx8fDE3NzA3NDIxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
      />
      
      {/* Mobile Container */}
      <div className="relative z-30 max-w-md mx-auto min-h-screen flex flex-col">
        
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#D4AF37]" />
            <h1 
              className="text-2xl text-[#D4AF37] tracking-wider"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              SUGR
            </h1>
          </div>
          
          {currentView === 'discover' && (
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                <Filter className="w-5 h-5 text-white/80" />
              </button>
            </div>
          )}

          {currentView === 'trips' && (
            <button className="p-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:shadow-lg transition-all">
              <Plus className="w-5 h-5 text-black" />
            </button>
          )}
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 px-4 pb-24 relative">
          <AnimatePresence mode="wait">
            {/* Discover View */}
            {currentView === 'discover' && (
              <motion.div
                key="discover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col pt-4"
              >
                {/* Swipe Cards */}
                <div className="relative w-full mx-auto" style={{ height: 'calc(100vh - 280px)', maxWidth: '400px' }}>
                  <AnimatePresence>
                    {profiles.slice(currentProfileIndex, currentProfileIndex + 2).map((profile, index) => (
                      <SwipeCard
                        key={profile.id}
                        profile={profile}
                        onSwipe={index === 0 ? handleSwipe : () => {}}
                        style={{
                          zIndex: 2 - index,
                          scale: 1 - index * 0.05,
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center items-center gap-6 mt-6">
                  <button
                    onClick={() => handleManualAction('pass')}
                    className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm border-2 border-red-500/50 
                             flex items-center justify-center hover:bg-red-500/10 hover:border-red-500 
                             transition-all active:scale-90 shadow-lg"
                  >
                    <Heart className="w-7 h-7 text-red-500 rotate-180" />
                  </button>

                  <button
                    onClick={() => handleManualAction('like')}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F]
                             flex items-center justify-center hover:shadow-2xl hover:shadow-[#D4AF37]/50
                             transition-all active:scale-90 shadow-xl"
                  >
                    <Heart className="w-9 h-9 text-white" fill="currentColor" />
                  </button>

                  <button
                    className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm border-2 border-[#D4AF37]/50 
                             flex items-center justify-center hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] 
                             transition-all active:scale-90 shadow-lg"
                  >
                    <Flame className="w-7 h-7 text-[#D4AF37]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Trips Feed View */}
            {currentView === 'trips' && (
              <motion.div
                key="trips"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pb-4 h-full overflow-y-auto"
              >
                <div className="mb-4">
                  <h2 className="text-white text-xl mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Available Now
                  </h2>
                  <p className="text-white/50 text-sm">Find companions in your city or plan trips together</p>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search by city..."
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl pl-11 pr-4 py-3
                               text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                    />
                  </div>
                </div>

                <TripsFeed 
                  trips={tripPosts} 
                  onTripClick={(trip) => console.log('Clicked trip:', trip)}
                />
              </motion.div>
            )}

            {/* Matches View */}
            {currentView === 'matches' && (
              <motion.div
                key="matches"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto"
              >
                <h2 className="text-white text-xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Your Matches
                </h2>
                
                {matches.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">No matches yet</p>
                    <p className="text-white/30 text-sm mt-2">Keep swiping to find your perfect match</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.map((profile) => (
                      <div 
                        key={profile.id}
                        className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-2xl p-4 
                                 border border-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#D4AF37]/30">
                            <img 
                              src={profile.imageUrl} 
                              alt={profile.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{profile.name}, {profile.age}</h3>
                            <p className="text-white/60 text-sm">{profile.location}</p>
                          </div>
                          <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Messages View */}
            {currentView === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <h2 className="text-white text-xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Messages
                </h2>
                
                <div className="text-center py-16">
                  <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">No messages yet</p>
                  <p className="text-white/30 text-sm mt-2">Start matching to begin conversations</p>
                </div>
              </motion.div>
            )}

            {/* Profile View */}
            {currentView === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto"
              >
                <h2 className="text-white text-xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Profile
                </h2>
                
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-2xl p-6 border border-white/5">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center mb-3">
                      <User className="w-12 h-12 text-black" />
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-1">Premium Member</h3>
                    <p className="text-[#D4AF37] text-sm">Verified Account</p>
                  </div>
                  
                  <div className="space-y-2">
                    {['Edit Profile', 'Preferences', 'Subscription', 'Privacy', 'Settings'].map((item) => (
                      <button
                        key={item}
                        className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/5 
                                 text-white hover:bg-white/10 hover:border-white/10 transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <motion.nav 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto"
        >
          <div className="bg-black/80 backdrop-blur-xl border-t border-white/5 px-4 py-3">
            <div className="flex items-center justify-around">
              {[
                { id: 'discover', icon: Flame, label: 'Discover' },
                { id: 'trips', icon: Plus, label: 'Trips' },
                { id: 'matches', icon: Heart, label: 'Matches' },
                { id: 'messages', icon: MessageCircle, label: 'Messages' },
                { id: 'profile', icon: User, label: 'Profile' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id as any)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    currentView === id
                      ? 'text-[#D4AF37]'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 ${currentView === id && id === 'matches' ? 'fill-[#D4AF37]' : ''}`}
                  />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Match Popup */}
      <AnimatePresence>
        {matchedProfile && (
          <MatchPopup
            profile={matchedProfile}
            currentUser={currentUser}
            onClose={() => setMatchedProfile(null)}
            onMessage={() => {
              setMatchedProfile(null);
              setCurrentView('messages');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}