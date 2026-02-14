import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = "", filled = false, size }) => {
  return (
    <span 
      className={`material-symbols-rounded ${className}`} 
      style={{ 
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        fontSize: size ? `${size}px` : undefined
      }}
    >
      {name}
    </span>
  );
};