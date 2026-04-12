'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ComboState } from '@/types';

interface ComboCounterProps {
  combo: ComboState;
  className?: string;
}

function getComboColor(multiplier: number): string {
  if (multiplier >= 5) return 'text-purple-500 bg-purple-50 border-purple-200';
  if (multiplier >= 3) return 'text-red-500 bg-red-50 border-red-200';
  if (multiplier >= 2) return 'text-orange-500 bg-orange-50 border-orange-200';
  if (multiplier >= 1.5) return 'text-amber-500 bg-amber-50 border-amber-200';
  return 'text-stone-400 bg-stone-50 border-stone-200';
}

export function ComboCounter({ combo, className = '' }: ComboCounterProps) {
  if (!combo.isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={combo.count}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${getComboColor(combo.multiplier)} ${className}`}
      >
        <motion.span
          className="text-lg"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.3 }}
        >
          ⚡
        </motion.span>
        <span className="text-sm font-bold">{combo.count}x</span>
        <span className="text-xs font-semibold opacity-75">{combo.multiplier}x</span>
      </motion.div>
    </AnimatePresence>
  );
}
