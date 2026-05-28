import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THINKING_STEPS = [
  'INITIALIZING SYSTEM COGNITION...',
  'ACCESSING SQLite NEURAL STORAGE...',
  'RESOLVING PRISMA SCHEMAS...',
  'PARSING INTEGRATED GROQ PIPELINE...',
  'SOLVING GRAPH MATRIX COEFFICIENTS...',
  'GENERATING OPTIMAL CONVERSATION RESPONSE...',
];

export const ThinkingHUD: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment logs dynamically
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < THINKING_STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    // Progress bar fill animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const add = Math.floor(Math.random() * 12) + 4;
        return Math.min(prev + add, 100);
      });
    }, 150);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto my-6 p-5 rounded-2xl border border-purple-500/20 bg-neutral-950/75 backdrop-blur-md shadow-2xl relative overflow-hidden select-none font-mono"
    >
      {/* Laser sweep animation overlay */}
      <div className="absolute inset-0 bg-hud-grid opacity-15 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40 shadow-[0_0_8px_#8b5cf6]" 
           style={{
             animation: 'ambient-glow 2.5s ease-in-out infinite alternate',
             transform: `translateY(${progress * 2.5}px)`
           }} 
      />

      {/* Header telemetry */}
      <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-white/5 text-[9px] text-gray-500 font-bold select-none tracking-widest">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" /> NEURAL PROCESS RUNNING</span>
        <span>SYS CORE v3.0</span>
      </div>

      {/* Steps diagnostic log */}
      <div className="flex flex-col gap-1.5 h-36 justify-end overflow-hidden pb-1">
        <AnimatePresence>
          {THINKING_STEPS.slice(0, currentStep + 1).map((step, idx) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`text-xs flex items-center justify-between tracking-wide select-none ${
                idx === currentStep ? 'text-purple-400 font-bold' : 'text-gray-400'
              }`}
            >
              <span>{`> ${step}`}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                idx === currentStep ? 'bg-purple-500/20 text-purple-400 animate-pulse' : 'bg-white/5 text-gray-500'
              }`}>
                {idx === currentStep ? 'RUNNING' : 'DONE'}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Processing loading bar */}
      <div className="mt-4 flex flex-col gap-1.5 select-none">
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold tracking-wider">
          <span>COGNITIVE COMPLIANCE INDEX</span>
          <span className="text-purple-400 font-mono">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5 p-0.5 flex items-center">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full shadow-[0_0_10px_#8b5cf6]" 
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
      </div>

    </motion.div>
  );
};
