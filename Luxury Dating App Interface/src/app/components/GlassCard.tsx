import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-[#2A0505]/40 to-[#1A0303]/60
        backdrop-blur-xl
        border border-[#D4AF37]/30
        shadow-[0_8px_32px_rgba(42,5,5,0.5),inset_0_1px_2px_rgba(212,175,55,0.1)]
        ${hover ? 'transition-all duration-300 hover:shadow-[0_12px_48px_rgba(212,175,55,0.3),inset_0_1px_2px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]/50 hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
