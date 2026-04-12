'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getXPForNextLevel, getLevelDefinition } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { bt } from '@/lib/i18n';

interface XPBarProps {
  className?: string;
}

export function XPBar({ className = '' }: XPBarProps) {
  const { xp, level } = useStore(s => s.progress);
  const lang = useStore(s => s.settings.baseLanguage);
  const { current, required, progress } = getXPForNextLevel(xp);
  const levelDef = getLevelDefinition(level);
  const [xpPopup, setXpPopup] = useState<number | null>(null);
  const [prevXP, setPrevXP] = useState(xp);

  useEffect(() => {
    if (xp > prevXP) {
      setXpPopup(xp - prevXP);
      const timer = setTimeout(() => setXpPopup(null), 1200);
      setPrevXP(xp);
      return () => clearTimeout(timer);
    }
    setPrevXP(xp);
  }, [xp, prevXP]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-3">
        {/* Level badge */}
        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
          <span className="text-sm">{levelDef.icon}</span>
          <span className="text-xs font-bold text-amber-700">Lv.{level}</span>
        </div>

        {/* XP bar */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[10px] text-stone-500">{bt(levelDef.title, lang)}</span>
            <span className="text-[10px] font-medium text-amber-600">{current}/{required} XP</span>
          </div>
          <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* XP popup */}
      <AnimatePresence>
        {xpPopup && (
          <motion.div
            className="absolute -top-6 right-0 text-sm font-bold text-amber-500"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            +{xpPopup} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
