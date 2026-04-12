import type { ComboState, LevelDefinition } from '@/types';
import levelsData from '@/data/levels.json';

const levels = levelsData as LevelDefinition[];

// Combo multiplier thresholds
export function getComboMultiplier(count: number): number {
  if (count >= 15) return 5;
  if (count >= 10) return 3;
  if (count >= 6) return 2;
  if (count >= 3) return 1.5;
  return 1;
}

export function nextCombo(combo: ComboState, correct: boolean): ComboState {
  if (!correct) {
    return { count: 0, multiplier: 1, isActive: false };
  }
  const newCount = combo.count + 1;
  return {
    count: newCount,
    multiplier: getComboMultiplier(newCount),
    isActive: newCount >= 3,
  };
}

export function calculateXP(baseXP: number, combo: ComboState): number {
  return Math.round(baseXP * combo.multiplier);
}

// Level calculations
export function getLevelForXP(xp: number): number {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xpRequired) return levels[i].level;
  }
  return 1;
}

export function getLevelDefinition(level: number): LevelDefinition {
  return levels.find(l => l.level === level) || levels[0];
}

export function getXPForNextLevel(currentXP: number): { current: number; required: number; progress: number } {
  const currentLevel = getLevelForXP(currentXP);
  const currentLevelDef = levels.find(l => l.level === currentLevel);
  const nextLevelDef = levels.find(l => l.level === currentLevel + 1);

  if (!nextLevelDef || !currentLevelDef) {
    return { current: currentXP, required: currentXP, progress: 1 };
  }

  const xpIntoLevel = currentXP - currentLevelDef.xpRequired;
  const xpNeeded = nextLevelDef.xpRequired - currentLevelDef.xpRequired;

  return {
    current: xpIntoLevel,
    required: xpNeeded,
    progress: Math.min(xpIntoLevel / xpNeeded, 1),
  };
}

// Date helpers
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return dateStr.startsWith(getTodayISO());
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function isYesterday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr.startsWith(yesterday.toISOString().split('T')[0]);
}

// Format time
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// CEFR level display
export function cefrDisplay(level: string): string {
  return level.replace('.', '');
}

// Accuracy calculation
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

// Streak color based on length
export function getStreakColor(streak: number): string {
  if (streak >= 91) return 'text-purple-500';
  if (streak >= 31) return 'text-blue-500';
  if (streak >= 8) return 'text-orange-500';
  return 'text-yellow-500';
}

export function getStreakGlow(streak: number): string {
  if (streak >= 91) return 'shadow-purple-500/50';
  if (streak >= 31) return 'shadow-blue-500/50';
  if (streak >= 8) return 'shadow-orange-500/50';
  return 'shadow-yellow-500/50';
}
