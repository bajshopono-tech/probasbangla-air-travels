import React from "react";

// Premium gold and deep rich Islamic green color scheme
export const GOLD = "#C9A84C";
export const GOLD_LIGHT = "#E2C876";
export const DEEP_GREEN = "#032014";
export const EMERALD_DARK = "#052F1E";
export const EMERALD_LIGHT = "#10B981";

// Geometric star patterns and separators for a premium Islamic-Arabic aesthetic
export function ArabicDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/50" />
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.5"
        className="rotate-45"
      >
        <rect x="6" y="6" width="12" height="12" />
        <rect x="9" y="9" width="6" height="6" fill={GOLD} />
      </svg>
      <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/50" />
    </div>
  );
}

export function Star8Point({ className = "w-6 h-6", color = GOLD }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      className={`${className}`}
    >
      <path
        d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z"
        fill={`${color}1A`}
      />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  );
}

// Background repeating geometric pattern
export function IslamicPatternBackground() {
  return (
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 60 30 L 30 60 L 0 30 Z M 0 0 L 30 30 L 0 60 M 60 0 L 30 30 L 60 60"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="1"
            />
            <circle cx="30" cy="30" r="3" fill="#C9A84C" />
            <circle cx="0" cy="0" r="1.5" fill="#C9A84C" />
            <circle cx="60" cy="0" r="1.5" fill="#C9A84C" />
            <circle cx="0" cy="60" r="1.5" fill="#C9A84C" />
            <circle cx="60" cy="60" r="1.5" fill="#C9A84C" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-grid)" />
      </svg>
    </div>
  );
}

// Corner ornaments for cards
export function CornerOrnaments() {
  return (
    <>
      {/* Top Left */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 opacity-40 pointer-events-none" style={{ borderColor: GOLD }} />
      {/* Top Right */}
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 opacity-40 pointer-events-none" style={{ borderColor: GOLD }} />
      {/* Bottom Left */}
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 opacity-40 pointer-events-none" style={{ borderColor: GOLD }} />
      {/* Bottom Right */}
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 opacity-40 pointer-events-none" style={{ borderColor: GOLD }} />
    </>
  );
}

// Premium brand logo component for Probasbangla Air Travels
export function ProbasBanglaLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`${className} relative flex items-center justify-center select-none`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform hover:scale-105 transition-transform duration-500"
      >
        <defs>
          <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EED994" />
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#9B7C2A" />
          </linearGradient>
          <linearGradient id="logo-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#052F1E" />
            <stop offset="100%" stopColor="#0E6B43" />
          </linearGradient>
          <filter id="logo-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer Circular Rim */}
        <circle cx="50" cy="50" r="45" stroke="url(#logo-gold)" strokeWidth="2.5" opacity="0.85" />
        
        {/* Inner Dotted Globe Ring */}
        <circle cx="50" cy="50" r="38" stroke="url(#logo-gold)" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
        
        {/* Abstract Globe Longitude/Latitude lines */}
        <path d="M 12 50 C 30 40, 70 40, 88 50" stroke="url(#logo-gold)" strokeWidth="0.75" opacity="0.35" />
        <path d="M 12 50 C 30 60, 70 60, 88 50" stroke="url(#logo-gold)" strokeWidth="0.75" opacity="0.35" />
        <path d="M 50 12 C 40 30, 40 70, 50 88" stroke="url(#logo-gold)" strokeWidth="0.75" opacity="0.35" />
        <path d="M 50 12 C 60 30, 60 70, 50 88" stroke="url(#logo-gold)" strokeWidth="0.75" opacity="0.35" />

        {/* Deep Green Elegant Solid Core */}
        <circle cx="50" cy="50" r="32" fill="url(#logo-emerald)" filter="url(#logo-shadow)" />

        {/* Dynamic Islamic Crescent Crescent & Star Accent */}
        <path
          d="M 62 38 C 62 48, 52 56, 42 54 C 37 53, 33 49, 31 44 C 34 51, 43 54, 50 51 C 55 49, 59 44, 59 38 C 59 37, 59 36, 59 35 C 61 36, 62 37, 62 38 Z"
          fill="url(#logo-gold)"
        />
        
        {/* Little shining stars */}
        <path d="M 40 28 L 42 32 L 46 32 L 43 34 L 44 38 L 40 35 L 36 38 L 37 34 L 34 32 L 38 32 Z" fill="url(#logo-gold)" transform="scale(0.5) translate(40, 20)" />

        {/* Sleek Takeoff Airplane Soaring upward right */}
        <path
          d="M 28 66 L 44 56 L 68 34 C 71 31, 74 31, 75 33 C 76 34, 75 37, 72 40 L 51 61 L 43 74 L 40 64 L 28 66 Z"
          fill="url(#logo-gold)"
        />
        {/* Shadow trailing edge of plane */}
        <path
          d="M 28 66 L 43 56.5 L 40 64 Z"
          fill="#111111"
          opacity="0.25"
        />
      </svg>
    </div>
  );
}
