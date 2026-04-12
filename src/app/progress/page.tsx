'use client';

import { useStore } from '@/lib/store';
import { calculateAccuracy, formatMinutes, getLevelDefinition } from '@/lib/utils';
import { getAllAchievements } from '@/lib/curriculum';
import { bt } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { motion } from 'framer-motion';

export default function ProgressPage() {
  const lang = useStore(s => s.settings.baseLanguage);
  const progress = useStore(s => s.progress);
  const cards = useStore(s => s.cards);

  const totalWords = Object.values(cards).filter(c => c.type === 'vocabulary').length;
  const masteredWords = Object.values(cards).filter(c => c.type === 'vocabulary' && c.masteryStars >= 4).length;
  const grammarRules = Object.values(cards).filter(c => c.type === 'grammar').length;
  const accuracy = calculateAccuracy(progress.totalCorrectAnswers, progress.totalAnswers);
  const timeStudied = formatMinutes(Math.round(progress.totalTimeSpentSeconds / 60));
  const levelDef = getLevelDefinition(progress.level);
  const achievements = getAllAchievements();
  const studyDays = Object.keys(progress.studyDays).length;

  // CEFR progress estimation
  const cefrProgress = Math.min(totalWords / 5000, 1);
  const cefrLabel = totalWords < 300 ? 'A1.1' : totalWords < 600 ? 'A1.2' : totalWords < 1200 ? 'A2.1' : totalWords < 2000 ? 'A2.2' : totalWords < 3500 ? 'B1' : 'B2';

  // Heatmap data (last 12 weeks)
  const today = new Date();
  const heatmapWeeks = 12;
  const heatmapDays: { date: string; xp: number }[] = [];
  for (let i = heatmapWeeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    heatmapDays.push({ date: dateStr, xp: progress.studyDays[dateStr] || 0 });
  }

  const maxXP = Math.max(...heatmapDays.map(d => d.xp), 1);

  return (
    <div className="flex-1 pb-24">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-stone-900">
          {lang === 'sv' ? 'Din framsteg' : 'Your Progress'}
        </h1>

        {/* CEFR progress */}
        <Card>
          <div className="text-sm font-semibold text-stone-700 mb-2">
            {lang === 'sv' ? 'CEFR-nivå' : 'CEFR Level'}
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-bold text-teal-600">{cefrLabel}</span>
            <div className="flex-1">
              <ProgressBar progress={cefrProgress} variant="cefr" size="lg" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 font-medium">
            <span>A1</span><span>A2</span><span>B1</span><span>B2</span>
          </div>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: totalWords, label: lang === 'sv' ? 'Ord inlärda' : 'Words learned', icon: '📝', color: 'text-blue-600' },
            { value: masteredWords, label: lang === 'sv' ? 'Ord behärskade' : 'Words mastered', icon: '⭐', color: 'text-amber-600' },
            { value: grammarRules, label: lang === 'sv' ? 'Grammatikregler' : 'Grammar rules', icon: '📏', color: 'text-teal-600' },
            { value: `${accuracy}%`, label: lang === 'sv' ? 'Precision' : 'Accuracy', icon: '🎯', color: 'text-green-600' },
            { value: progress.completedLessonIds.length, label: lang === 'sv' ? 'Lektioner' : 'Lessons', icon: '📖', color: 'text-indigo-600' },
            { value: timeStudied, label: lang === 'sv' ? 'Studietid' : 'Study time', icon: '⏱️', color: 'text-purple-600' },
            { value: progress.streak, label: lang === 'sv' ? 'Streak' : 'Streak', icon: '🔥', color: 'text-orange-600' },
            { value: progress.longestStreak, label: lang === 'sv' ? 'Längsta streak' : 'Best streak', icon: '🏆', color: 'text-yellow-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card padding="sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stat.icon}</span>
                  <div>
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] text-stone-500">{stat.label}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Study heatmap */}
        <Card>
          <div className="text-sm font-semibold text-stone-700 mb-3">
            {lang === 'sv' ? 'Studiekalender' : 'Study Calendar'}
          </div>
          <div className="text-xs text-stone-400 mb-2">
            {studyDays} {lang === 'sv' ? 'dagar studerat' : 'days studied'}
          </div>
          <div className="grid grid-cols-12 gap-1">
            {heatmapDays.map((day, i) => {
              const intensity = day.xp / maxXP;
              const bg = day.xp === 0
                ? 'bg-stone-100'
                : intensity > 0.75
                ? 'bg-green-500'
                : intensity > 0.5
                ? 'bg-green-400'
                : intensity > 0.25
                ? 'bg-green-300'
                : 'bg-green-200';
              return (
                <div
                  key={i}
                  className={`w-full aspect-square rounded-sm ${bg}`}
                  title={`${day.date}: ${day.xp} XP`}
                />
              );
            })}
          </div>
        </Card>

        {/* Achievements */}
        <Card>
          <div className="text-sm font-semibold text-stone-700 mb-3">
            {lang === 'sv' ? 'Prestationer' : 'Achievements'}
            <span className="text-stone-400 font-normal ml-2">
              {progress.unlockedAchievementIds.length}/{achievements.length}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {achievements.slice(0, 20).map(ach => {
              const unlocked = progress.unlockedAchievementIds.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`text-center p-2 rounded-xl ${unlocked ? 'bg-amber-50' : 'bg-stone-100 opacity-40'}`}
                  title={bt(ach.name, lang)}
                >
                  <div className={`text-2xl ${unlocked ? '' : 'grayscale'}`}>{ach.icon}</div>
                  <div className="text-[8px] text-stone-500 mt-0.5 truncate">{bt(ach.name, lang)}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Level */}
        <Card padding="sm" className="text-center">
          <span className="text-2xl">{levelDef.icon}</span>
          <div className="text-sm font-bold text-stone-900 mt-1">
            Lv.{progress.level} — {levelDef.titleGreek}
          </div>
          <div className="text-xs text-stone-500">{bt(levelDef.title, lang)}</div>
          <div className="text-xs text-amber-600 font-medium mt-1">{progress.xp} XP</div>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
