import { motion } from 'motion/react';
import { Heart, MessageCircle, X } from 'lucide-react';
import { Profile } from './SwipeCard';

interface MatchPopupProps {
  profile: Profile;
  currentUser: { name: string; imageUrl: string };
  onClose: () => void;
  onMessage: () => void;
}

export function MatchPopup({ profile, currentUser, onClose, onMessage }: MatchPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative max-w-md w-full"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Match Animation */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <h1 
              className="text-5xl text-[#D4AF37] mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              It's a Match!
            </h1>
          </motion.div>
          <p className="text-white/70 text-sm">
            You and {profile.name} have liked each other
          </p>
        </div>

        {/* Profile Images */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#D4AF37]/50 shadow-2xl">
              <img 
                src={currentUser.imageUrl} 
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center shadow-2xl">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#D4AF37]/50 shadow-2xl">
              <img 
                src={profile.imageUrl} 
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button
            onClick={onMessage}
            className="w-full bg-gradient-to-r from-[#D4AF37] via-[#EEC373] to-[#D4AF37] 
                     text-black font-bold py-4 rounded-xl
                     shadow-[0_4px_20px_rgba(212,175,55,0.4)]
                     hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)]
                     transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Send Message
          </button>

          <button
            onClick={onClose}
            className="w-full bg-white/5 backdrop-blur-sm text-white font-medium py-4 rounded-xl
                     border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            Keep Swiping
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
