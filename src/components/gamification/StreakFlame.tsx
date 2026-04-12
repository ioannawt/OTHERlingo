'use client';

import { motion } from 'framer-motion';
import { getStreakColor } from '@/lib/utils';

interface StreakFlameProps {
  streak: number;
  className?: string;
}

export function StreakFlame({ streak, className = '' }: StreakFlameProps) {
  const color = getStreakColor(streak);
  const flameSize = streak >= 31 ? 'text-4xl' : streak >= 8 ? 'text-3xl' : 'text-2xl';

  if (streak === 0) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <span className="text-2xl opacity-40">🔥</span>
        <span className="text-sm font-bold text-stone-400">0</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`flex items-center gap-1.5 ${className}`}
      whileHover={{ scale: 1.1 }}
    >
      <motion.span
        className={`${flameSize} animate-flame`}
        animate={{
          scale: [1, 1.05, 0.98, 1.03, 1],
          rotate: [-2, 1, -1, 2, -2],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🔥
      </motion.span>
      <span className={`text-sm font-bold ${color}`}>{streak}</span>
    </motion.div>
  );
}
