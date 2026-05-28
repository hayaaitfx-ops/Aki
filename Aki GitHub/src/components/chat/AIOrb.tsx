import React from 'react';
import { motion } from 'framer-motion';

interface AIOrbProps {
  status: 'idle' | 'thinking' | 'hearing' | 'speaking';
  theme: 'purple' | 'cyberpunk' | 'emerald' | 'crimson' | 'nordic' | 'sakura' | 'synthwave' | 'obsidian' | 'forest';
  overclocked?: boolean;
}

export const AIOrb: React.FC<AIOrbProps> = ({ status, theme, overclocked = false }) => {
  const getColors = () => {
    switch (theme) {
      case 'cyberpunk':
        return {
          primary: 'rgba(217, 119, 6, 0.85)',
          glow: 'rgba(217, 119, 6, 0.35)',
          core: 'from-amber-500 via-yellow-600 to-amber-700',
          ring: 'border-amber-500/25',
          text: 'text-amber-500',
        };
      case 'emerald':
        return {
          primary: 'rgba(5, 150, 105, 0.85)',
          glow: 'rgba(5, 150, 105, 0.35)',
          core: 'from-emerald-400 via-teal-600 to-emerald-700',
          ring: 'border-emerald-500/25',
          text: 'text-emerald-500',
        };
      case 'crimson':
        return {
          primary: 'rgba(239, 68, 68, 0.85)',
          glow: 'rgba(239, 68, 68, 0.35)',
          core: 'from-red-500 via-rose-600 to-red-800',
          ring: 'border-red-500/25',
          text: 'text-red-500',
        };
      case 'nordic':
        return {
          primary: 'rgba(56, 189, 248, 0.85)',
          glow: 'rgba(56, 189, 248, 0.35)',
          core: 'from-sky-400 via-blue-600 to-sky-800',
          ring: 'border-sky-500/25',
          text: 'text-sky-400',
        };
      case 'sakura':
        return {
          primary: 'rgba(236, 72, 153, 0.85)',
          glow: 'rgba(236, 72, 153, 0.35)',
          core: 'from-pink-400 via-fuchsia-600 to-pink-700',
          ring: 'border-pink-500/25',
          text: 'text-pink-400',
        };
      case 'synthwave':
        return {
          primary: 'rgba(6, 182, 212, 0.85)',
          glow: 'rgba(6, 182, 212, 0.35)',
          core: 'from-cyan-400 via-fuchsia-600 to-indigo-700',
          ring: 'border-cyan-500/25',
          text: 'text-cyan-400',
        };
      case 'obsidian':
        return {
          primary: 'rgba(234, 179, 8, 0.85)',
          glow: 'rgba(234, 179, 8, 0.35)',
          core: 'from-amber-400 via-zinc-850 to-yellow-600',
          ring: 'border-yellow-500/25',
          text: 'text-amber-400',
        };
      case 'forest':
        return {
          primary: 'rgba(168, 85, 247, 0.85)',
          glow: 'rgba(168, 85, 247, 0.35)',
          core: 'from-purple-500 via-emerald-600 to-purple-800',
          ring: 'border-purple-500/25',
          text: 'text-purple-400',
        };
      default:
        return {
          primary: 'rgba(139, 92, 246, 0.85)',
          glow: 'rgba(139, 92, 246, 0.35)',
          core: 'from-purple-500 via-violet-600 to-indigo-700',
          ring: 'border-purple-500/25',
          text: 'text-purple-400',
        };
    }
  };

  const colors = getColors();
  if (overclocked) {
    colors.primary = 'rgba(249, 115, 22, 0.95)';
    colors.glow = 'rgba(249, 115, 22, 0.45)';
    colors.core = 'from-amber-400 via-orange-500 to-red-600 shadow-[0_0_25px_rgba(249,115,22,0.8)]';
    colors.ring = 'border-orange-500/40';
    colors.text = 'text-orange-500';
  }

  // Pulse rates, organic borderRadius and scales depending on state
  const getPulseProps = () => {
    if (overclocked) {
      return {
        scale: [1, 1.25, 1],
        rotate: [0, 360],
        borderRadius: ["50%", "40% 60% 40% 60% / 60% 40% 60% 40%", "50%"],
        opacity: [0.95, 1, 0.95],
        transition: { duration: 0.65, repeat: Infinity, ease: "linear" }
      };
    }
    if (status === 'thinking') {
      return {
        scale: [1, 1.12, 1],
        rotate: 360,
        borderRadius: ["50%", "45% 55% 53% 47% / 47% 53% 47% 53%", "53% 47% 45% 55% / 53% 47% 53% 47%", "50%"],
        opacity: [0.8, 1, 0.8],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      };
    }
    if (status === 'hearing') {
      return {
        scale: [1, 1.22, 1],
        borderRadius: ["50%", "42% 58% 55% 45% / 45% 55% 45% 55%", "55% 45% 42% 58% / 55% 45% 55% 45%", "50%"],
        opacity: [0.7, 1, 0.7],
        transition: { duration: 1.0, repeat: Infinity, ease: "linear" }
      };
    }
    if (status === 'speaking') {
      return {
        scale: [1, 1.16, 1],
        rotate: [0, 90, 180, 270, 360],
        borderRadius: ["50%", "40% 60% 50% 50% / 50% 50% 60% 40%", "60% 40% 55% 45% / 45% 55% 40% 60%", "50%"],
        opacity: [0.85, 1, 0.85],
        transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
      };
    }
    return {
      scale: [1, 1.05, 1],
      borderRadius: ["50%", "48% 52% 51% 49% / 49% 51% 49% 51%", "51% 49% 48% 52% / 51% 49% 51% 49%", "50%"],
      opacity: [0.65, 0.85, 0.65],
      transition: { duration: 4.0, repeat: Infinity, ease: "easeInOut" }
    };
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-10 select-none">
      <div className="relative w-72 h-72 flex items-center justify-center">
        
        {/* Deep volumetric background glow */}
        <div 
          className="absolute w-60 h-60 rounded-full blur-[65px] mix-blend-screen transition-all duration-700 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
            opacity: status === 'thinking' ? 0.55 : status === 'hearing' ? 0.65 : status === 'speaking' ? 0.75 : 0.28,
          }}
        />

        {/* CRT Scanline overlay inside core */}
        <div className="absolute inset-0 rounded-full bg-hud-grid opacity-30 pointer-events-none z-10" />

        {/* Outer Tech Ring 1 (Slow Rotation) */}
        <div className={`absolute inset-0 rounded-full border border-dashed ${colors.ring} ${overclocked ? 'animate-spin border-orange-500/50' : 'animate-slow-rotate'}`} style={{ animationDuration: overclocked ? '2.5s' : '20s' }} />

        {/* Tech Ring 2 (Reversed Rotation, Tick marks) */}
        <div className={`absolute w-[90%] h-[90%] rounded-full border border-[1.5px] border-dotted ${colors.ring} opacity-80 ${overclocked ? 'animate-reverse-rotate border-red-500/40' : 'animate-reverse-rotate'}`} style={{ animationDuration: overclocked ? '1.5s' : '15s' }} />

        {/* HUD Data Ring 3 (Bracket indicators) */}
        <div className="absolute w-[80%] h-[80%] flex items-center justify-center animate-orbit-pulse opacity-50">
          <div className={`w-full h-1 border-t border-b ${colors.ring} flex justify-between`} />
          <div className={`h-full w-1 border-l border-r ${colors.ring} flex flex-col justify-between absolute`} />
        </div>

        {/* Dynamic Expanding Waves (Ripples) when active */}
        {(status === 'speaking' || status === 'thinking' || status === 'hearing' || overclocked) && (
          <>
            <motion.div
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
              transition={{ duration: 2.0, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-44 h-44 rounded-full border border-dashed pointer-events-none"
              style={{ borderColor: colors.primary }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
              transition={{ duration: 2.0, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
              className="absolute w-44 h-44 rounded-full border border-dotted pointer-events-none"
              style={{ borderColor: colors.primary }}
            />
          </>
        )}

        {/* Interactive Holographic Core Orb (morphs dynamically) */}
        <motion.div
          animate={getPulseProps() as any}
          className={`w-36 h-36 bg-gradient-to-tr ${colors.core} p-1 shadow-2xl flex items-center justify-center relative cursor-pointer group`}
        >
          {/* Internal Holographic Grid Reflection */}
          <div className="absolute inset-2 border border-white/10 bg-black/10 backdrop-blur-sm overflow-hidden flex items-center justify-center"
               style={{ borderRadius: 'inherit' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_25%,rgba(255,255,255,0.18)_0%,transparent_60%)] z-10" />
            <div className="absolute inset-0 bg-hud-grid opacity-40 animate-pulse" />
          </div>

          {/* Shimmer glow overlay */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md`} 
               style={{ boxShadow: `0 0 35px ${colors.primary}`, borderRadius: 'inherit' }} />
        </motion.div>

        {/* Holographic orbital energy particle nodes */}
        <div className="absolute inset-10 animate-slow-rotate pointer-events-none">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full`} style={{ backgroundColor: colors.primary, boxShadow: `0 0 10px ${colors.primary}` }} />
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full`} style={{ backgroundColor: colors.primary, boxShadow: `0 0 10px ${colors.primary}` }} />
        </div>

      </div>

      {/* Futuristic Operating System HUD Telemetry Readouts */}
      <div className="mt-6 flex flex-col items-center gap-1.5 font-mono select-none">
        <span className={`text-[11px] font-bold tracking-[0.25em] ${colors.text} uppercase`}>
          {status === 'thinking' 
            ? 'COMPILING CONSCIOUSNESS VECTOR...' 
            : status === 'hearing' 
            ? 'CAPTURING AUDIO SIGNAL...' 
            : status === 'speaking'
            ? 'STREAMING CONSCIOUSNESS SIGNAL...'
            : 'AKI OPERATING SYSTEM CORE'}
        </span>
        <div className="flex items-center gap-2 text-[9px] text-gray-500 tracking-wider">
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === 'thinking' 
                ? 'bg-purple-500 animate-ping' 
                : status === 'hearing' 
                ? 'bg-cyan-400 animate-ping' 
                : status === 'speaking'
                ? 'bg-cyan-300 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                : 'bg-emerald-500'
            }`} /> 
            MODULE STATE: {status === 'speaking' ? 'TRANSMITTING' : 'STABLE'}
          </span>
          <span>•</span>
          <span>FREQ: {status === 'thinking' ? '986Hz' : status === 'hearing' ? '1240Hz' : status === 'speaking' ? '880Hz' : '520Hz'}</span>
          <span>•</span>
          <span>DB: SQLite WAL</span>
        </div>
        {status === 'speaking' && (
          <div className="mt-3 flex items-end gap-[3px] h-3.5 justify-center select-none pointer-events-none">
            <span className="w-[2px] rounded-full animate-bounce bg-cyan-400" style={{ height: '70%', animationDuration: '0.45s', boxShadow: '0 0 6px #22d3ee' }} />
            <span className="w-[2px] rounded-full animate-bounce bg-cyan-400" style={{ height: '40%', animationDuration: '0.65s', animationDelay: '0.1s', boxShadow: '0 0 6px #22d3ee' }} />
            <span className="w-[2px] rounded-full animate-bounce bg-cyan-400" style={{ height: '90%', animationDuration: '0.35s', animationDelay: '0.2s', boxShadow: '0 0 6px #22d3ee' }} />
            <span className="w-[2px] rounded-full animate-bounce bg-cyan-400" style={{ height: '55%', animationDuration: '0.55s', animationDelay: '0.05s', boxShadow: '0 0 6px #22d3ee' }} />
            <span className="w-[2px] rounded-full animate-bounce bg-cyan-400" style={{ height: '80%', animationDuration: '0.5s', animationDelay: '0.15s', boxShadow: '0 0 6px #22d3ee' }} />
          </div>
        )}
      </div>

    </div>
  );
};
