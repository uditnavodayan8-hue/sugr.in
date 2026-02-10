import { ReactNode } from 'react';

interface LuxuryButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    fullWidth?: boolean;
}

export function LuxuryButton({
    children,
    onClick,
    variant = 'primary',
    className = '',
    fullWidth = false
}: LuxuryButtonProps) {

    const baseStyles = `
    relative overflow-hidden rounded-xl px-8 py-4
    font-bold text-sm tracking-wider uppercase
    transition-all duration-300 transform
    active:scale-95
    ${fullWidth ? 'w-full' : ''}
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-[#D4AF37] via-[#EEC373] to-[#D4AF37]
      bg-[length:200%_100%]
      text-[#050505]
      shadow-[0_4px_20px_rgba(212,175,55,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.3)]
      hover:shadow-[0_6px_30px_rgba(212,175,55,0.6),0_0_40px_rgba(180,5,5,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3)]
      hover:bg-[position:100%_0]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
    `,
        secondary: `
      bg-[#2A0505]
      text-[#D4AF37]
      border-2 border-[#D4AF37]/50
      shadow-[0_4px_20px_rgba(42,5,5,0.6),inset_0_1px_2px_rgba(212,175,55,0.1)]
      hover:bg-[#3A0808]
      hover:border-[#D4AF37]
      hover:shadow-[0_6px_30px_rgba(212,175,55,0.4),inset_0_1px_2px_rgba(212,175,55,0.2)]
    `,
        outline: `
      bg-transparent
      text-[#D4AF37]
      border-2 border-[#D4AF37]/30
      hover:border-[#D4AF37]/70
      hover:bg-[#D4AF37]/10
      hover:shadow-[0_4px_20px_rgba(212,175,55,0.2)]
    `
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
