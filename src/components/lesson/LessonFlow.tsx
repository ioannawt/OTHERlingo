'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lesson, AnswerResult, BaseLanguage } from '@/types';
import { useStore } from '@/lib/store';
import { bt } from '@/lib/i18n';
import { playSoundEffect } from '@/lib/audio';
import { StoryPanel } from './StoryPanel';
import { GrammarSpotlight } from './GrammarSpotlight';
import { DrillExercise } from './DrillExercise';
import { ComboCounter } from '@/components/gamification/ComboCounter';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Timer } from '@/components/ui/Timer';

type Phase = 'story' | 'grammar' | 'drills' | 'speed' | 'complete';

interface LessonFlowProps {
  lesson: Lesson;
  onComplete: (xpEarned: number, accuracy: number) => void;
  onExit: () => void;
}

const phaseOrder: Phase[] = ['story', 'grammar', 'drills', 'speed', 'complete'];

export function LessonFlow({ lesson, onComplete, onExit }: LessonFlowProps) {
  const lang = useStore(s => s.settings.baseLanguage);
  const { session, startSession, setPhase, recordAnswer, getCombo } = useStore();

  const [currentPhase, setCurrentPhase] = useState<Phase>('story');
  const [drillIndex, setDrillIndex] = useState(0);
  const [speedDrillIndex, setSpeedDrillIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [totalXP, setTotalXP] = useState(0);

  // Initialize session on first render
  useState(() => {
    startSession(lesson.id);
  });

  const combo = getCombo();
  const totalDrills = lesson.drills.length;
  const speedDrills = lesson.speedRound.drillIds
    .map(id => lesson.drills.find(d => d.id === id))
    .filter(Boolean) as typeof lesson.drills;

  const getPhaseProgress = (): number => {
    const idx = phaseOrder.indexOf(currentPhase);
    if (currentPhase === 'drills') {
      return (idx + drillIndex / Math.max(totalDrills, 1)) / phaseOrder.length;
    }
    if (currentPhase === 'speed') {
      return (idx + speedDrillIndex / Math.max(speedDrills.length, 1)) / phaseOrder.length;
    }
    return idx / phaseOrder.length;
  };

  const advancePhase = useCallback(() => {
    const idx = phaseOrder.indexOf(currentPhase);
    let nextPhase = phaseOrder[idx + 1];

    // Skip grammar if null
    if (nextPhase === 'grammar' && !lesson.grammarSpotlight) {
      nextPhase = 'drills';
    }

    if (nextPhase) {
      setCurrentPhase(nextPhase);
      setPhase(nextPhase);
    }
  }, [currentPhase, lesson.grammarSpotlight, setPhase]);

  const handleDrillAnswer = useCallback((result: AnswerResult) => {
    recordAnswer(result);
    setAnswers(prev => [...prev, result]);
    setTotalXP(prev => prev + result.xpAwarded);

    if (drillIndex + 1 >= totalDrills) {
      // Move to speed round
      setCurrentPhase('speed');
      setPhase('speed');
    } else {
      setDrillIndex(prev => prev + 1);
    }
  }, [drillIndex, totalDrills, recordAnswer, setPhase]);

  const handleSpeedAnswer = useCallback((result: AnswerResult) => {
    recordAnswer(result);
    setAnswers(prev => [...prev, result]);
    setTotalXP(prev => prev + result.xpAwarded);

    if (speedDrillIndex + 1 >= speedDrills.length) {
      setCurrentPhase('complete');
      setPhase('complete');
      playSoundEffect('complete');
    } else {
      setSpeedDrillIndex(prev => prev + 1);
    }
  }, [speedDrillIndex, speedDrills.length, recordAnswer, setPhase]);

  const handleSpeedTimeout = useCallback(() => {
    setCurrentPhase('complete');
    setPhase('complete');
    playSoundEffect('complete');
  }, [setPhase]);

  const correctAnswers = answers.filter(a => a.correct).length;
  const accuracy = answers.length > 0 ? Math.round((correctAnswers / answers.length) * 100) : 0;

  const phaseLabels: Record<Phase, { en: string; sv: string }> = {
    story: { en: 'Story', sv: 'Berättelse' },
    grammar: { en: 'Grammar', sv: 'Grammatik' },
    drills: { en: 'Drills', sv: 'Övningar' },
    speed: { en: 'Speed Round', sv: 'Snabbomgång' },
    complete: { en: 'Complete', sv: 'Klar' },
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Top bar */}
      {currentPhase !== 'complete' && (
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pb-3 pt-2">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={onExit} className="text-stone-400 hover:text-stone-600 text-xl p-1">
              ✕
            </button>
            <div className="flex-1">
              <ProgressBar progress={getPhaseProgress()} variant="default" size="sm" />
            </div>
            {currentPhase === 'speed' && (
              <Timer totalSeconds={lesson.speedRound.timeLimit} onComplete={handleSpeedTimeout} />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              {bt(phaseLabels[currentPhase], lang)}
              {currentPhase === 'drills' && ` (${drillIndex + 1}/${totalDrills})`}
              {currentPhase === 'speed' && ` (${speedDrillIndex + 1}/${speedDrills.length})`}
            </span>
            <ComboCounter combo={combo} />
          </div>
        </div>
      )}

      {/* Phase content */}
        <div
          key={`${currentPhase}-${drillIndex}-${speedDrillIndex}`}
          className="pb-8 animate-slide-up"
        >
          {currentPhase === 'story' && (
            <StoryPanel
              story={lesson.story}
              lang={lang}
              onComplete={advancePhase}
            />
          )}

          {currentPhase === 'grammar' && lesson.grammarSpotlight && (
            <GrammarSpotlight
              spotlight={lesson.grammarSpotlight}
              lang={lang}
              onComplete={advancePhase}
            />
          )}

          {currentPhase === 'drills' && drillIndex < totalDrills && (
            <DrillExercise
              key={`drill-${drillIndex}`}
              drill={lesson.drills[drillIndex]}
              lang={lang}
              combo={combo}
              onAnswer={handleDrillAnswer}
            />
          )}

          {currentPhase === 'speed' && speedDrillIndex < speedDrills.length && (
            <div>
              <div className="text-center mb-4">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  ⚡ {lang === 'sv' ? 'Snabbomgång' : 'Speed Round'} ⚡
                </span>
              </div>
              <DrillExercise
                key={`speed-${speedDrillIndex}`}
                drill={speedDrills[speedDrillIndex]}
                lang={lang}
                combo={combo}
                onAnswer={handleSpeedAnswer}
              />
            </div>
          )}

          {currentPhase === 'complete' && (
            <CompletionScreen
              lessonTitle={bt(lesson.title, lang)}
              totalXP={totalXP}
              accuracy={accuracy}
              correctAnswers={correctAnswers}
              totalAnswers={answers.length}
              streak={useStore.getState().progress.streak}
              lang={lang}
              idiom={lesson.idiom}
              onContinue={() => onComplete(totalXP, accuracy)}
            />
          )}
        </div>
    </div>
  );
}

// === Completion Screen ===

interface CompletionScreenProps {
  lessonTitle: string;
  totalXP: number;
  accuracy: number;
  correctAnswers: number;
  totalAnswers: number;
  streak: number;
  lang: BaseLanguage;
  idiom?: Lesson['idiom'];
  onContinue: () => void;
}

function CompletionScreen({
  lessonTitle,
  totalXP,
  accuracy,
  correctAnswers,
  totalAnswers,
  streak,
  lang,
  idiom,
  onContinue,
}: CompletionScreenProps) {
  return (
    <div className="text-center space-y-6 py-8">
      {/* Celebration */}
      <div className="text-6xl animate-slide-up">
        🎉
      </div>

      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          {lang === 'sv' ? 'Lektion klar!' : 'Lesson Complete!'}
        </h2>
        <p className="text-stone-500 mt-1">{lessonTitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 animate-slide-up">
          <div className="text-2xl font-bold text-amber-600">+{totalXP}</div>
          <div className="text-xs text-amber-700">XP</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100 animate-slide-up">
          <div className="text-2xl font-bold text-emerald-600">{accuracy}%</div>
          <div className="text-xs text-emerald-700">
            {lang === 'sv' ? 'Precision' : 'Accuracy'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-4 border border-rose-100 animate-slide-up">
          <div className="text-2xl font-bold text-rose-600">{streak}🔥</div>
          <div className="text-xs text-rose-700">
            {lang === 'sv' ? 'Streak' : 'Streak'}
          </div>
        </div>
      </div>

      {/* Score detail */}
      <div className="text-sm text-stone-500">
        {correctAnswers}/{totalAnswers} {lang === 'sv' ? 'rätt' : 'correct'}
      </div>

      {/* Idiom of the lesson */}
      {idiom && (
        <div
          className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 text-left border border-purple-100 animate-slide-up"
        >
          <div className="text-xs font-semibold text-purple-600 uppercase mb-1">
            {lang === 'sv' ? 'Dagens uttryck' : "Today's expression"}
          </div>
          <div className="greek-text text-purple-900 font-semibold">{idiom.greek}</div>
          <div className="text-sm text-purple-700 mt-1">
            {lang === 'sv' ? 'Bokstavligen: ' : 'Literally: '}{bt(idiom.literal, lang)}
          </div>
          <div className="text-sm text-purple-800 font-medium mt-1">
            {bt(idiom.meaning, lang)}
          </div>
        </div>
      )}

      {/* Continue */}
      <Button onClick={onContinue} size="lg" fullWidth variant="accent">
        {lang === 'sv' ? 'Fortsätt' : 'Continue'}
      </Button>
    </div>
  );
}
