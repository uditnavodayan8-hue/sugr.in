import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  fallbackImage?: string;
  overlay?: boolean;
}

export function VideoBackground({ fallbackImage, overlay = true }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fallback Image */}
      {fallbackImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}

      {/* Multiple gradient overlays for sophisticated look */}
      {overlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A0505]/20 via-transparent to-[#2A0505]/20 z-10" />
          <div className="absolute inset-0 bg-[#050505]/40 z-10" />
        </>
      )}

      {/* Subtle animated glow */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B0000]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}
