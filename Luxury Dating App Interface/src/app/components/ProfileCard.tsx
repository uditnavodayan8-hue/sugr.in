import { Heart, X, Sparkles, MapPin, Briefcase } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { motion } from 'motion/react';

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  occupation: string;
  imageUrl: string;
  bio: string;
  verified?: boolean;
}

export function ProfileCard({ 
  name, 
  age, 
  location, 
  occupation, 
  imageUrl, 
  bio,
  verified = true 
}: ProfileCardProps) {
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="w-full max-w-sm mx-auto"
    >
      <GlassCard hover className="overflow-hidden">
        {/* Image Section */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          
          {/* Verified badge */}
          {verified && (
            <div className="absolute top-4 right-4 bg-[#D4AF37] rounded-full p-2 shadow-lg">
              <Sparkles className="w-4 h-4 text-[#050505]" />
            </div>
          )}
          
          {/* Profile info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-white mb-1">
                  {name}, {age}
                </h2>
                <div className="flex items-center gap-2 text-[#D4AF37]/90 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Briefcase className="w-4 h-4" />
                  <span>{occupation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bio Section */}
        <div className="p-6">
          <p className="text-white/80 text-sm leading-relaxed italic">
            "{bio}"
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="px-6 pb-6 flex gap-4">
          <button
            className="flex-1 bg-[#2A0505]/80 backdrop-blur-sm border-2 border-red-900/50 text-white rounded-xl py-4 
                     shadow-[0_4px_20px_rgba(139,0,0,0.3)] 
                     hover:bg-red-900/30 hover:border-red-800 hover:shadow-[0_6px_30px_rgba(180,5,5,0.5)]
                     transition-all duration-300 active:scale-95"
          >
            <X className="w-6 h-6 mx-auto" />
          </button>
          
          <button
            className="flex-1 bg-gradient-to-r from-[#D4AF37] via-[#EEC373] to-[#D4AF37] 
                     text-[#050505] rounded-xl py-4
                     shadow-[0_4px_20px_rgba(212,175,55,0.5),0_0_30px_rgba(212,175,55,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2)]
                     hover:shadow-[0_6px_30px_rgba(212,175,55,0.7),0_0_50px_rgba(212,175,55,0.5)]
                     transition-all duration-300 active:scale-95 relative overflow-hidden
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
                     before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
          >
            <Heart className="w-6 h-6 mx-auto relative z-10" fill="currentColor" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
