'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  UserProgress,
  UserSettings,
  ReviewCard,
  ComboState,
  LessonSession,
  AnswerResult,
  BaseLanguage,
} from '@/types';
import { createReviewCard, processReview, type Rating } from '@/lib/fsrs';
import { nextCombo, calculateXP, getLevelForXP, getTodayISO, isToday, isYesterday } from '@/lib/utils';

interface AppState {
  // Progress
  progress: UserProgress;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  unlockAchievement: (id: string) => void;
  setCurrentLesson: (worldId: number, chapterId: string, lessonId: string) => void;
  resetProgress: () => void;

  // Reviews
  cards: Record<string, ReviewCard>;
  addCard: (type: ReviewCard['type'], contentId: string) => void;
  reviewCard: (cardId: string, rating: Rating) => void;
  getCardsByType: (type: ReviewCard['type']) => ReviewCard[];
  getDueCardCount: () => number;

  // Session
  session: LessonSession | null;
  startSession: (lessonId: string) => void;
  setPhase: (phase: LessonSession['phase']) => void;
  recordAnswer: (result: AnswerResult) => void;
  getCombo: () => ComboState;
  endSession: () => void;

  // Settings
  settings: UserSettings;
  setBaseLanguage: (lang: BaseLanguage) => void;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  completeOnboarding: () => void;
}

const defaultProgress: UserProgress = {
  currentWorldId: 1,
  currentChapterId: 'w1-c1',
  currentLessonId: 'w1-c1-l1',
  completedLessonIds: [],
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  todayLessonComplete: false,
  totalReviewsDone: 0,
  totalCorrectAnswers: 0,
  totalAnswers: 0,
  totalTimeSpentSeconds: 0,
  unlockedAchievementIds: [],
  startDate: getTodayISO(),
  studyDays: {},
};

const defaultSettings: UserSettings = {
  baseLanguage: 'en',
  showRomanization: true,
  enableSoundEffects: true,
  enableAnimations: true,
  onboardingComplete: false,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // === Progress ===
      progress: { ...defaultProgress },

      completeLesson: (lessonId: string, xpEarned: number) => {
        set((state) => {
          const today = getTodayISO();
          const newCompleted = state.progress.completedLessonIds.includes(lessonId)
            ? state.progress.completedLessonIds
            : [...state.progress.completedLessonIds, lessonId];

          const newXP = state.progress.xp + xpEarned;
          const newLevel = getLevelForXP(newXP);

          // Update study days
          const studyDays = { ...state.progress.studyDays };
          studyDays[today] = (studyDays[today] || 0) + xpEarned;

          return {
            progress: {
              ...state.progress,
              completedLessonIds: newCompleted,
              xp: newXP,
              level: newLevel,
              todayLessonComplete: true,
              lastSessionDate: new Date().toISOString(),
              studyDays,
            },
          };
        });
        // Update streak after completing
        get().updateStreak();
      },

      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.progress.xp + amount;
          return {
            progress: {
              ...state.progress,
              xp: newXP,
              level: getLevelForXP(newXP),
            },
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          const { lastSessionDate, streak } = state.progress;
          const today = getTodayISO();

          let newStreak = streak;

          if (isToday(lastSessionDate)) {
            // Already studied today, keep current streak
            newStreak = streak;
          } else if (isYesterday(lastSessionDate)) {
            // Studied yesterday, increment streak
            newStreak = streak + 1;
          } else if (lastSessionDate === null) {
            // First ever session
            newStreak = 1;
          } else {
            // Missed a day, reset streak
            newStreak = 1;
          }

          return {
            progress: {
              ...state.progress,
              streak: newStreak,
              longestStreak: Math.max(newStreak, state.progress.longestStreak),
              lastSessionDate: new Date().toISOString(),
              studyDays: {
                ...state.progress.studyDays,
                [today]: state.progress.studyDays[today] || 0,
              },
            },
          };
        });
      },

      unlockAchievement: (id: string) => {
        set((state) => {
          if (state.progress.unlockedAchievementIds.includes(id)) return state;
          return {
            progress: {
              ...state.progress,
              unlockedAchievementIds: [...state.progress.unlockedAchievementIds, id],
            },
          };
        });
      },

      setCurrentLesson: (worldId, chapterId, lessonId) => {
        set((state) => ({
          progress: {
            ...state.progress,
            currentWorldId: worldId,
            currentChapterId: chapterId,
            currentLessonId: lessonId,
          },
        }));
      },

      resetProgress: () => {
        set({
          progress: { ...defaultProgress, startDate: getTodayISO() },
          cards: {},
          session: null,
        });
      },

      // === Reviews ===
      cards: {},

      addCard: (type, contentId) => {
        const card = createReviewCard(type, contentId);
        set((state) => ({
          cards: { ...state.cards, [card.id]: card },
        }));
      },

      reviewCard: (cardId, rating) => {
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;
          const updated = processReview(card, rating);
          return {
            cards: { ...state.cards, [cardId]: updated },
            progress: {
              ...state.progress,
              totalReviewsDone: state.progress.totalReviewsDone + 1,
            },
          };
        });
      },

      getCardsByType: (type) => {
        return Object.values(get().cards).filter(c => c.type === type);
      },

      getDueCardCount: () => {
        const now = new Date();
        return Object.values(get().cards).filter(
          c => c.state === 0 || new Date(c.due) <= now
        ).length;
      },

      // === Session ===
      session: null,

      startSession: (lessonId) => {
        set({
          session: {
            lessonId,
            phase: 'story',
            currentDrillIndex: 0,
            answers: [],
            combo: { count: 0, multiplier: 1, isActive: false },
            xpEarned: 0,
            startTime: Date.now(),
            accuracy: 0,
          },
        });
      },

      setPhase: (phase) => {
        set((state) => {
          if (!state.session) return state;
          return { session: { ...state.session, phase } };
        });
      },

      recordAnswer: (result) => {
        set((state) => {
          if (!state.session) return state;
          const newAnswers = [...state.session.answers, result];
          const correct = newAnswers.filter(a => a.correct).length;
          const newCombo = nextCombo(state.session.combo, result.correct);

          return {
            session: {
              ...state.session,
              answers: newAnswers,
              combo: newCombo,
              xpEarned: state.session.xpEarned + result.xpAwarded,
              accuracy: Math.round((correct / newAnswers.length) * 100),
              currentDrillIndex: state.session.currentDrillIndex + 1,
            },
            progress: {
              ...state.progress,
              totalCorrectAnswers: state.progress.totalCorrectAnswers + (result.correct ? 1 : 0),
              totalAnswers: state.progress.totalAnswers + 1,
            },
          };
        });
      },

      getCombo: () => {
        return get().session?.combo || { count: 0, multiplier: 1, isActive: false };
      },

      endSession: () => {
        const session = get().session;
        if (session) {
          const elapsed = Math.round((Date.now() - session.startTime) / 1000);
          set((state) => ({
            progress: {
              ...state.progress,
              totalTimeSpentSeconds: state.progress.totalTimeSpentSeconds + elapsed,
            },
            session: null,
          }));
        }
      },

      // === Settings ===
      settings: { ...defaultSettings },

      setBaseLanguage: (lang) => {
        set((state) => ({
          settings: { ...state.settings, baseLanguage: lang },
        }));
      },

      updateSetting: (key, value) => {
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        }));
      },

      completeOnboarding: () => {
        set((state) => ({
          settings: { ...state.settings, onboardingComplete: true },
        }));
      },
    }),
    {
      name: 'otherlingo-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        progress: state.progress,
        cards: state.cards,
        settings: state.settings,
      }),
    }
  )
);
