'use client';

import { motion } from 'framer-motion';
import type { BaseLanguage } from '@/types';
import { worlds } from '@/lib/curriculum';
import { bt } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import Link from 'next/link';

interface WorldMapProps {
  lang: BaseLanguage;
}

const worldIcons = ['🏝️', '🍷', '🏛️', '🏙️', '🌊', '⛰️'];
const worldEmojis = ['🇬🇷', '☀️', '🫒', '🏗️', '📚', '🦉'];

export function WorldMap({ lang }: WorldMapProps) {
  const completedLessons = useStore(s => s.progress.completedLessonIds);
  const currentWorldId = useStore(s => s.progress.currentWorldId);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
        {lang === 'sv' ? 'Din resa' : 'Your Journey'}
      </h2>
      <div className="space-y-3">
        {worlds.map((world, i) => {
          const isLocked = world.id > currentWorldId + 1;
          const isCurrent = world.id === currentWorldId;
          const isComplete = world.id < currentWorldId;
          const totalLessons = world.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
          const completedInWorld = world.chapters.reduce(
            (sum, ch) => sum + ch.lessons.filter(l => completedLessons.includes(l)).length,
            0
          );
          const progress = totalLessons > 0 ? completedInWorld / totalLessons : 0;

          const firstLessonId = world.chapters[0]?.lessons[0];

          return (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {isLocked ? (
                <div className="flex items-center gap-4 bg-stone-100 rounded-2xl p-4 opacity-50">
                  <div className="text-3xl grayscale">🔒</div>
                  <div className="flex-1">
                    <div className="font-semibold text-stone-400">{bt(world.name, lang)}</div>
                    <div className="text-xs text-stone-400">{world.cefrLevel}</div>
                  </div>
                </div>
              ) : (
                <Link href={firstLessonId ? `/lesson/${firstLessonId}` : '#'}>
                  <div
                    className={`flex items-center gap-4 rounded-2xl p-4 transition-all cursor-pointer hover:shadow-md ${
                      isCurrent
                        ? 'bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-200 shadow-sm'
                        : isComplete
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-white border border-stone-200'
                    }`}
                  >
                    <div className="text-3xl">{isComplete ? '✅' : worldIcons[i]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{bt(world.name, lang)}</span>
                        <span className="text-xs bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-medium">
                          {world.cefrLevel}
                        </span>
                        {isCurrent && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                            {lang === 'sv' ? 'Nuvarande' : 'Current'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {worldEmojis[i]} {world.targetVocabulary} {lang === 'sv' ? 'ord' : 'words'}
                        {totalLessons > 0 && ` · ${completedInWorld}/${totalLessons}`}
                      </div>
                      {(isCurrent || isComplete) && totalLessons > 0 && (
                        <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${isComplete ? 'bg-green-400' : 'bg-blue-400'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
