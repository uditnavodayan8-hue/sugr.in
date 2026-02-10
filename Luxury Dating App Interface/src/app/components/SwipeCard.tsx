import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Heart, X, MapPin, DollarSign, Calendar, Sparkles, Instagram, CheckCircle } from 'lucide-react';

export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  occupation: string;
  imageUrl: string;
  images?: string[];
  bio: string;
  verified?: boolean;
  role: 'sugar-baby' | 'sugar-daddy';
  allowanceRange?: string;
  lookingFor: string;
  lifestyle: string[];
  height?: string;
  instagram?: string;
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  style?: any;
}

export function SwipeCard({ profile, onSwipe, style }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const images = profile.images || [profile.imageUrl];

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  const handleImageClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-[#0A0A0A] shadow-2xl border border-white/5">
        {/* Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          onClick={handleImageClick}
          style={{
            backgroundImage: `url(${images[currentImageIndex]})`,
          }}
        >
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        </div>

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute top-4 left-0 right-0 flex gap-1 px-4 z-20">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top Info */}
        <div className="absolute top-6 right-4 z-20 flex flex-col items-end gap-2">
          {profile.verified && (
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4AF37]/30">
              <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" fill="currentColor" />
              <span className="text-white text-xs font-medium">Verified</span>
            </div>
          )}
          {profile.instagram && (
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Instagram className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="mb-3">
            <h2 className="text-white text-3xl mb-2 font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>
              {profile.name}, {profile.age}
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-white/80 text-sm bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.location}</span>
              </div>
              
              {profile.allowanceRange && (
                <div className="flex items-center gap-1.5 text-[#D4AF37] text-sm bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#D4AF37]/20">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{profile.allowanceRange}</span>
                </div>
              )}
            </div>

            <p className="text-white/90 text-sm mb-3 line-clamp-2">{profile.bio}</p>

            <div className="flex flex-wrap gap-1.5">
              {profile.lifestyle.slice(0, 3).map((item, idx) => (
                <span 
                  key={idx}
                  className="text-xs text-white/70 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-1/3 left-8 z-30"
          style={{
            opacity: useTransform(x, [-100, 0], [1, 0]),
          }}
        >
          <div className="border-4 border-red-500 text-red-500 px-6 py-3 rounded-2xl rotate-[-20deg] font-black text-3xl">
            NOPE
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-8 z-30"
          style={{
            opacity: useTransform(x, [0, 100], [0, 1]),
          }}
        >
          <div className="border-4 border-[#D4AF37] text-[#D4AF37] px-6 py-3 rounded-2xl rotate-[20deg] font-black text-3xl">
            LIKE
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
