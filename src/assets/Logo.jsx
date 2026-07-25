import React from 'react';

const Logo = ({ size = 32, className = '' }) => {
  return (
    <div className={`flex items-center gap-sm ${className}`} style={{ gap: '10px' }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        stroke="var(--accent)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <rect x="6" y="4" width="20" height="24" rx="3" strokeWidth="2" />
        <circle cx="16" cy="16" r="6" />
        <line x1="20" y1="20" x2="24" y2="24" />
      </svg>
      <span 
        style={{ 
          fontFamily: 'Manrope, sans-serif', 
          fontWeight: 600, 
          fontSize: size * 0.6,
          color: 'var(--text-primary)'
        }}
      >
        PageLens
      </span>
    </div>
  );
};

export default Logo;
