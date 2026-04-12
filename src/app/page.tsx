'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { formatMinutes, calculateAccuracy } from '@/lib/utils';
import { StreakFlame } from '@/components/gamification/StreakFlame';
import { XPBar } from '@/components/gamification/XPBar';
import { WorldMap } from '@/components/dashboard/WorldMap';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/navigation/BottomNav';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const lang = useStore(s => s.settings.baseLanguage);
  const progress = useStore(s => s.progress);
  const onboardingComplete = useStore(s => s.settings.onboardingComplete);

  if (!onboardingComplete) {
    return <OnboardingScreen />;
  }

  const totalWords = Object.keys(useStore.getState().cards).length;
  const accuracy = calculateAccuracy(progress.totalCorrectAnswers, progress.totalAnswers);
  const timeStudied = Math.round(progress.totalTimeSpentSeconds / 60);

  return (
    <div className="flex-1 pb-24">
      <header className="px-4 pt-4 pb-2">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <StreakFlame streak={progress.streak} />
          <div className="flex-1 mx-4">
            <XPBar />
          </div>
          <Link href="/settings" className="text-xl text-stone-400 hover:text-stone-600 transition-colors">
            ⚙️
          </Link>
        </div>
      </header>

      <main className="px-4 space-y-6 max-w-lg mx-auto">
        {/* Daily lesson card */}
        <Card className="!bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-500 !border-none text-white !shadow-lg !shadow-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-200 text-sm font-medium">
                {lang === 'sv' ? 'Dagens lektion' : "Today's Lesson"}
              </div>
              <div className="text-xl font-bold mt-1">
                {progress.todayLessonComplete
                  ? (lang === 'sv' ? 'Klar för idag! 🎉' : 'Done for today! 🎉')
                  : (lang === 'sv' ? 'Redo att lära dig?' : 'Ready to learn?')
                }
              </div>
              <div className="text-purple-200 text-xs mt-1">~20 min</div>
            </div>
            <div className="text-5xl">
              {progress.todayLessonComplete ? '✅' : '📖'}
            </div>
          </div>
          {!progress.todayLessonComplete && (
            <Button
              variant="accent"
              size="lg"
              fullWidth
              className="mt-4"
              onClick={() => router.push(`/lesson/${progress.currentLessonId}`)}
            >
              {progress.completedLessonIds.length === 0
                ? (lang === 'sv' ? 'Börja lära dig grekiska!' : 'Start learning Greek!')
                : (lang === 'sv' ? 'Fortsätt' : 'Continue')
              }
            </Button>
          )}
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 text-center border border-cyan-100">
            <div className="text-2xl font-bold text-cyan-600">{totalWords}</div>
            <div className="text-[10px] text-cyan-700/70 font-medium">
              {lang === 'sv' ? 'Ord' : 'Words'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 text-center border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600">{accuracy}%</div>
            <div className="text-[10px] text-emerald-700/70 font-medium">
              {lang === 'sv' ? 'Precision' : 'Accuracy'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-4 text-center border border-violet-100">
            <div className="text-2xl font-bold text-violet-600">{formatMinutes(timeStudied)}</div>
            <div className="text-[10px] text-violet-700/70 font-medium">
              {lang === 'sv' ? 'Studerat' : 'Studied'}
            </div>
          </div>
        </div>

        <WorldMap lang={lang} />

        <div className="text-center text-xs text-stone-400 pb-4">
          {progress.completedLessonIds.length} {lang === 'sv' ? 'lektioner avklarade' : 'lessons completed'}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function OnboardingScreen() {
  const setBaseLanguage = useStore(s => s.setBaseLanguage);
  const completeOnboarding = useStore(s => s.completeOnboarding);

  const handleStart = (lang: 'en' | 'sv') => {
    setBaseLanguage(lang);
    completeOnboarding();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-screen bg-white">
      <div className="max-w-sm w-full text-center space-y-8">
        <div>
          <div className="text-7xl mb-4">🇬🇷</div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500">OTHER</span>lingo
          </h1>
          <p className="text-gray-500 mt-3 text-sm">Learn Greek the OTHER way</p>
          <p className="text-gray-400 mt-0.5 text-xs">Lär dig grekiska på ett ANNAT sätt</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
          <p className="text-sm font-medium text-gray-700">
            Choose your language<br />
            <span className="text-gray-400">Välj ditt språk</span>
          </p>

          <Button variant="primary" size="lg" fullWidth onClick={() => handleStart('en')}>
            🇬🇧 English
          </Button>

          <Button variant="secondary" size="lg" fullWidth onClick={() => handleStart('sv')}>
            🇸🇪 Svenska
          </Button>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-400">Stories, not sentences.</p>
          <p className="text-xs text-gray-400">Production, not recognition.</p>
          <p className="text-xs text-gray-400">Real Greek, not textbook Greek.</p>
          <p className="text-xs text-gray-500 font-medium mt-2">20 minutes a day. That&apos;s it.</p>
        </div>
      </div>
    </div>
  );
}
