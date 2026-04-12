'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Drill, BaseLanguage, AnswerResult, ComboState } from '@/types';
import { bt } from '@/lib/i18n';
import { checkAnswer } from '@/lib/validation';
import { calculateXP } from '@/lib/utils';
import { speakGreek } from '@/lib/audio';
import { playSoundEffect } from '@/lib/audio';
import { GreekInput } from '@/components/ui/GreekInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface DrillExerciseProps {
  drill: Drill;
  lang: BaseLanguage;
  combo: ComboState;
  onAnswer: (result: AnswerResult) => void;
  showHint?: boolean;
}

function getDrillTypeLabel(type: string, lang: BaseLanguage): string {
  const labels: Record<string, { en: string; sv: string }> = {
    cloze: { en: 'Fill the blank', sv: 'Fyll i luckan' },
    substitution: { en: 'Substitute', sv: 'Byt ut' },
    transformation: { en: 'Transform', sv: 'Omvandla' },
    translation_g2e: { en: 'Translate to English', sv: 'Översätt till engelska' },
    translation_e2g: { en: 'Translate to Greek', sv: 'Översätt till grekiska' },
    listening: { en: 'Listen & type', sv: 'Lyssna & skriv' },
    free_typing: { en: 'Type in Greek', sv: 'Skriv på grekiska' },
  };
  return labels[type]?.[lang] || type;
}

export function DrillExercise({ drill, lang, combo, onAnswer }: DrillExerciseProps) {
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [startTime] = useState(Date.now());

  const handleSubmit = useCallback(() => {
    if (!userInput.trim() || showResult) return;

    const validation = checkAnswer(userInput, drill.correctAnswer, drill.acceptableAnswers);
    const xp = validation.correct ? calculateXP(drill.xpBase, combo) : 0;

    const answerResult: AnswerResult = {
      correct: validation.correct,
      userAnswer: userInput,
      correctAnswer: drill.correctAnswer,
      xpAwarded: xp,
      feedback: validation.feedback,
      accentNote: validation.accentNote,
    };

    setResult(answerResult);
    setShowResult(true);

    if (validation.correct) {
      playSoundEffect('correct');
      if (combo.count >= 2) playSoundEffect('combo');
    } else {
      playSoundEffect('incorrect');
    }
  }, [userInput, showResult, drill, combo]);

  const handleContinue = () => {
    if (result) {
      onAnswer(result);
    }
  };

  const handleHint = () => {
    setHintUsed(true);
  };

  const handleListen = () => {
    if (drill.type === 'listening' && drill.promptGreek) {
      speakGreek(drill.promptGreek);
    } else if (drill.type === 'translation_g2e' && drill.promptGreek) {
      speakGreek(drill.promptGreek);
    }
  };

  return (
    <div
      className="space-y-4 animate-slide-up"
    >
      {/* Drill type label */}
      <Badge variant="default">
        {getDrillTypeLabel(drill.type, lang)}
      </Badge>

      {/* Prompt */}
      <div className="text-stone-800 font-medium">
        {bt(drill.prompt, lang)}
      </div>

      {/* Context / Greek prompt */}
      {drill.type === 'cloze' && drill.context && (
        <div className="greek-text-large text-stone-900 bg-stone-50 rounded-xl p-4 text-center">
          {drill.context.replace('___', '______')}
        </div>
      )}

      {drill.type === 'listening' && (
        <button
          onClick={handleListen}
          className="w-full py-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-3"
        >
          <span className="text-4xl">🔊</span>
          <span className="text-blue-700 font-medium">
            {lang === 'sv' ? 'Tryck för att lyssna' : 'Tap to listen'}
          </span>
        </button>
      )}

      {(drill.type === 'translation_g2e' || drill.type === 'substitution' || drill.type === 'transformation') && drill.promptGreek && (
        <div
          className="greek-text-large text-stone-900 bg-stone-50 rounded-xl p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => drill.promptGreek && speakGreek(drill.promptGreek)}
        >
          {drill.promptGreek}
          <span className="text-stone-300 ml-2 text-sm">🔊</span>
        </div>
      )}

      {/* Substitution pattern */}
      {drill.type === 'substitution' && drill.sourcePattern && drill.targetPattern && (
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <span className="greek-text line-through text-stone-400">{drill.sourcePattern}</span>
          <span>→</span>
          <span className="greek-text font-semibold text-teal-600">{drill.targetPattern}</span>
        </div>
      )}

      {/* Transformation type */}
      {drill.type === 'transformation' && drill.transformationType && (
        <div className="text-sm text-stone-500 italic">
          ({drill.transformationType})
        </div>
      )}

      {/* Input */}
      {!showResult && (
        <div className="space-y-3">
          <GreekInput
            value={userInput}
            onChange={setUserInput}
            onSubmit={handleSubmit}
            placeholder={lang === 'sv' ? 'Skriv ditt svar...' : 'Type your answer...'}
            autoFocus
            large
          />

          {/* Hint */}
          {drill.hint && !hintUsed && (
            <button
              onClick={handleHint}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium"
            >
              💡 {lang === 'sv' ? 'Visa ledtråd' : 'Show hint'}
            </button>
          )}
          {hintUsed && drill.hint && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2"
            >
              💡 {bt(drill.hint, lang)}
            </motion.div>
          )}

          <Button onClick={handleSubmit} fullWidth disabled={!userInput.trim()}>
            {lang === 'sv' ? 'Kontrollera' : 'Check'}
          </Button>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`rounded-xl p-4 ${
                result.correct
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-red-50 border-2 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{result.correct ? '✅' : '❌'}</span>
                <span className={`font-bold ${result.correct ? 'text-green-700' : 'text-red-700'}`}>
                  {result.correct
                    ? (lang === 'sv' ? 'Rätt!' : 'Correct!')
                    : (lang === 'sv' ? 'Inte riktigt...' : 'Not quite...')
                  }
                </span>
                {result.correct && result.xpAwarded > 0 && (
                  <span className="text-sm font-bold text-amber-500 ml-auto">+{result.xpAwarded} XP</span>
                )}
              </div>

              {!result.correct && (
                <div className="text-sm">
                  <div className="text-red-600">
                    {lang === 'sv' ? 'Ditt svar: ' : 'Your answer: '}
                    <span className="greek-text">{result.userAnswer}</span>
                  </div>
                  <div className="text-green-700 mt-1">
                    {lang === 'sv' ? 'Rätt svar: ' : 'Correct answer: '}
                    <span
                      className="greek-text font-semibold cursor-pointer"
                      onClick={() => speakGreek(result.correctAnswer)}
                    >
                      {result.correctAnswer} <span className="text-xs">🔊</span>
                    </span>
                  </div>
                </div>
              )}

              {result.accentNote && (
                <div className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-3 py-1.5">
                  {lang === 'sv'
                    ? `Rätt! Men tänk på accenterna: ${result.feedback}`
                    : `Correct! But watch the accents: ${result.feedback}`
                  }
                </div>
              )}
            </div>

            <div className="mt-3">
              <Button onClick={handleContinue} fullWidth variant={result.correct ? 'success' : 'primary'}>
                {lang === 'sv' ? 'Forts��tt' : 'Continue'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
