import React from 'react';
import { motion } from 'framer-motion';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[var(--color-bg-bubble-ai)]/40 border border-[var(--color-primary)]/10 backdrop-blur-md shadow-inner select-none">
      <span className="text-xs font-mono text-[var(--color-primary)] tracking-wide animate-pulse">
        Aki está processando
      </span>
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};
