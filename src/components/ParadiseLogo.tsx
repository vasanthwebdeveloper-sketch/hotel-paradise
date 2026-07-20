import React from "react";

interface ParadiseLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  inline?: boolean;
}

export default function ParadiseLogo({ className = "", size = "md", inline = false }: ParadiseLogoProps) {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-48 w-48",
  };

  const containerSize = sizeClasses[size];

  if (inline) {
    return (
      <div className={`relative flex items-center gap-3 animate-hover-logo group ${className}`} id="hotel-paradise-logo-brand">
        {/* Sparkles / Spark effect elements */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <svg className="sparkle-particle w-4 h-4" style={{ '--x': '-12px', '--y': '-15px', 'animationDelay': '0s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
          <svg className="sparkle-particle w-3 h-3" style={{ '--x': '15px', '--y': '-20px', 'animationDelay': '0.15s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
          <svg className="sparkle-particle w-3.5 h-3.5" style={{ '--x': '45px', '--y': '-18px', 'animationDelay': '0.3s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
          <svg className="sparkle-particle w-2.5 h-2.5" style={{ '--x': '-15px', '--y': '12px', 'animationDelay': '0.45s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
          <svg className="sparkle-particle w-3.5 h-3.5" style={{ '--x': '100px', '--y': '15px', 'animationDelay': '0.2s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
          <svg className="sparkle-particle w-3 h-3" style={{ '--x': '135px', '--y': '-12px', 'animationDelay': '0.35s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
        </div>
        <svg
          viewBox="0 0 500 500"
          className="h-12 w-12 drop-shadow-[0_0_15px_rgba(255,170,0,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft Warm Neon Glow for Palm Tree and Sun */}
            <filter id="neon-glow-orange-icon" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur1" />
              <feGaussianBlur stdDeviation="15" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Cyan/Blue Glow for the Sea Waves */}
            <filter id="neon-glow-cyan-icon" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feGaussianBlur stdDeviation="12" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glowing Sun */}
          <circle
            cx="340"
            cy="150"
            r="35"
            stroke="#ff9900"
            strokeWidth="5"
            fill="none"
            filter="url(#neon-glow-orange-icon)"
          />

          {/* Sun background ocean arc reflection */}
          <path
            d="M 280 185 A 100 80 0 0 1 400 195"
            stroke="#ff6600"
            strokeWidth="4"
            fill="none"
            filter="url(#neon-glow-orange-icon)"
          />

          {/* Sea Waves (Cyan Neon) */}
          <path
            d="M 285 220 Q 320 214 355 220 T 410 220"
            stroke="#00e5ff"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            filter="url(#neon-glow-cyan-icon)"
          />
          <path
            d="M 295 236 Q 325 231 355 236 T 400 236"
            stroke="#00b0ff"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#neon-glow-cyan-icon)"
          />
          <path
            d="M 130 220 Q 195 214 260 220"
            stroke="#00e5ff"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            filter="url(#neon-glow-cyan-icon)"
          />

          {/* Palm Tree Trunk (Yellow-Orange Glow) */}
          <path
            d="M 130 270 Q 110 200 185 160"
            stroke="#ffa500"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            filter="url(#neon-glow-orange-icon)"
          />

          {/* Palm Tree Trunk segments */}
          <path d="M 125 248 L 135 250" stroke="#ffdd00" strokeWidth="4.5" strokeLinecap="round" filter="url(#neon-glow-orange-icon)" />
          <path d="M 118 226 L 128 228" stroke="#ffdd00" strokeWidth="4.5" strokeLinecap="round" filter="url(#neon-glow-orange-icon)" />
          <path d="M 117 204 L 127 206" stroke="#ffdd00" strokeWidth="4.5" strokeLinecap="round" filter="url(#neon-glow-orange-icon)" />
          <path d="M 124 184 L 135 185" stroke="#ffdd00" strokeWidth="4.5" strokeLinecap="round" filter="url(#neon-glow-orange-icon)" />

          {/* Palm Tree Fronds */}
          {/* Leaf 1 - top left */}
          <path
            d="M 185 160 Q 140 120 90 148"
            stroke="#ffa500"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            filter="url(#neon-glow-orange-icon)"
          />
          {/* Leaf 2 - top */}
          <path
            d="M 185 160 Q 185 95 155 75"
            stroke="#ffdd00"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            filter="url(#neon-glow-orange-icon)"
          />
          {/* Leaf 3 - top right */}
          <path
            d="M 185 160 Q 230 110 255 140"
            stroke="#ffa500"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            filter="url(#neon-glow-orange-icon)"
          />
          {/* Leaf 4 - left */}
          <path
            d="M 185 160 Q 125 155 105 188"
            stroke="#ff8800"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            filter="url(#neon-glow-orange-icon)"
          />
          {/* Leaf 5 - right */}
          <path
            d="M 185 160 Q 240 170 230 205"
            stroke="#ff8800"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            filter="url(#neon-glow-orange-icon)"
          />
        </svg>
        <div className="flex flex-col">
          <span className="font-serif text-xl tracking-widest text-gold font-bold uppercase leading-none">
            Hotel Paradise
          </span>
          <span className="text-[9px] uppercase tracking-[0.27em] text-white/70 font-semibold mt-0.5">
            Luxury Resort & Sea
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-center bg-black/80 p-8 rounded-2xl border-2 border-gold/25 shadow-[0_0_30px_rgba(212,175,55,0.15)] animate-hover-logo group ${className}`} id="hotel-paradise-logo-bento">
      {/* Sparkles / Spark effect elements */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <svg className="sparkle-particle w-5 h-5" style={{ '--x': '-55px', '--y': '-50px', 'animationDelay': '0s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
        <svg className="sparkle-particle w-4 h-4" style={{ '--x': '60px', '--y': '-70px', 'animationDelay': '0.15s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
        <svg className="sparkle-particle w-4.5 h-4.5" style={{ '--x': '90px', '--y': '50px', 'animationDelay': '0.3s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
        <svg className="sparkle-particle w-3.5 h-3.5" style={{ '--x': '-70px', '--y': '70px', 'animationDelay': '0.45s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
        <svg className="sparkle-particle w-5 h-5" style={{ '--x': '-110px', '--y': '-15px', 'animationDelay': '0.2s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
        <svg className="sparkle-particle w-4 h-4" style={{ '--x': '120px', '--y': '-25px', 'animationDelay': '0.35s' } as any} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/></svg>
      </div>
      <svg
        viewBox="0 0 500 500"
        className={`${containerSize} max-w-full drop-shadow-[0_0_20px_rgba(255,170,0,0.5)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="neon-glow-orange" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="20" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neon-glow-cyan" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="15" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neon-glow-red" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur1" />
            <feGaussianBlur stdDeviation="15" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neon-glow-white" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glowing frame/halo arc */}
        <path
          d="M 80 400 A 210 210 0 1 1 420 400"
          stroke="#ff5500"
          strokeWidth="3.5"
          strokeDasharray="12 4"
          fill="none"
          filter="url(#neon-glow-red)"
          opacity="0.85"
        />

        {/* Sun setting over the ocean */}
        <circle
          cx="335"
          cy="150"
          r="38"
          stroke="#ffaa00"
          strokeWidth="6.5"
          fill="none"
          filter="url(#neon-glow-orange)"
        />

        <path
          d="M 270 190 A 100 80 0 0 1 400 200"
          stroke="#ff4400"
          strokeWidth="5"
          fill="none"
          filter="url(#neon-glow-orange)"
        />

        {/* Cyan Sea Waves */}
        <path
          d="M 285 220 Q 320 214 355 220 T 425 220"
          stroke="#00e5ff"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow-cyan)"
        />
        <path
          d="M 295 236 Q 325 231 355 236 T 415 236"
          stroke="#00b0ff"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow-cyan)"
        />
        <path
          d="M 120 220 Q 190 214 260 220"
          stroke="#00e5ff"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow-cyan)"
        />

        {/* Palm Tree Trunk */}
        <path
          d="M 130 270 Q 110 200 185 160"
          stroke="#ffa500"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow-orange)"
        />

        {/* Palm Trunk Rings */}
        <path d="M 125 248 L 135 250" stroke="#ffdd00" strokeWidth="5.5" strokeLinecap="round" filter="url(#neon-glow-orange)" />
        <path d="M 118 226 L 128 228" stroke="#ffdd00" strokeWidth="5.5" strokeLinecap="round" filter="url(#neon-glow-orange)" />
        <path d="M 117 204 L 127 206" stroke="#ffdd00" strokeWidth="5.5" strokeLinecap="round" filter="url(#neon-glow-orange)" />
        <path d="M 124 184 L 135 185" stroke="#ffdd00" strokeWidth="5.5" strokeLinecap="round" filter="url(#neon-glow-orange)" />

        {/* Palm Tree Leaves */}
        <path
          d="M 185 160 Q 140 120 85 148"
          stroke="#ffa500"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow-orange)"
        />
        <path
          d="M 185 160 Q 185 95 155 72"
          stroke="#ffdd00"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow-orange)"
          id="leaf-top"
        />
        <path
          d="M 185 160 Q 230 110 258 140"
          stroke="#ffa500"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow-orange)"
        />
        <path
          d="M 185 160 Q 125 155 105 188"
          stroke="#ff7700"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow-orange)"
        />
        <path
          d="M 185 160 Q 240 170 230 205"
          stroke="#ff7700"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#neon-glow-orange)"
        />

        {/* Text Area */}
        {/* HOTEL */}
        <text
          x="250"
          y="290"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="8"
          filter="url(#neon-glow-white)"
        >
          HOTEL
        </text>

        {/* Paradise */}
        <text
          x="250"
          y="355"
          textAnchor="middle"
          fill="#ff4400"
          fontSize="72"
          fontStyle="italic"
          fontWeight="bold"
          fontFamily="'Playfair Display', 'Brush Script MT', 'Great Vibes', cursive, serif"
          filter="url(#neon-glow-orange)"
          className="animate-pulse"
        >
          Paradise
        </text>

        {/* RESORT */}
        <text
          x="250"
          y="405"
          textAnchor="middle"
          fill="#ffa500"
          fontSize="18"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="12"
          filter="url(#neon-glow-orange)"
        >
          RESORT
        </text>
      </svg>
    </div>
  );
}
