'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { Achievement, BaseLanguage } from '@/types';
import { bt } from '@/lib/i18n';

interface AchievementPopupProps {
  achievement: Achievement | null;
  lang: BaseLanguage;
  onDismiss: () => void;
}

export function AchievementPopup({ achievement, lang, onDismiss }: AchievementPopupProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed inset-x-0 top-4 z-[100] flex justify-center px-4"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          onClick={onDismiss}
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl shadow-purple-500/30 max-w-sm w-full">
            <div className="flex items-center gap-3">
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                {achievement.icon}
              </motion.span>
              <div>
                <div className="text-xs font-medium text-purple-200 uppercase tracking-wider">
                  {lang === 'sv' ? 'Prestation upplåst!' : 'Achievement Unlocked!'}
                </div>
                <div className="font-bold text-lg">{bt(achievement.name, lang)}</div>
                <div className="text-sm text-purple-100">{bt(achievement.description, lang)}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
