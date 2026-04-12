'use client';

import { useState, useMemo, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { getDueCards, type Rating, performanceToRating } from '@/lib/fsrs';
import { getVocabularyItem, getGrammarRule } from '@/lib/curriculum';
import { checkAnswer } from '@/lib/validation';
import { calculateXP, nextCombo } from '@/lib/utils';
import { playSoundEffect, speakGreek } from '@/lib/audio';
import { GreekInput } from '@/components/ui/GreekInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ComboCounter } from '@/components/gamification/ComboCounter';
import { BottomNav } from '@/components/navigation/BottomNav';
import { StarRating } from '@/components/ui/StarRating';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReviewCard, ComboState } from '@/types';

export default function ReviewPage() {
  const lang = useStore(s => s.settings.baseLanguage);
  const cards = useStore(s => s.cards);
  const reviewCard = useStore(s => s.reviewCard);
  const addXP = useStore(s => s.addXP);

  const dueCards = useMemo(() => getDueCards(Object.values(cards)), [cards]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [combo, setCombo] = useState<ComboState>({ count: 0, multiplier: 1, isActive: false });
  const [input, setInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [startTime] = useState(Date.now());

  const currentCard = dueCards[currentIndex];

  const getCardContent = useCallback((card: ReviewCard) => {
    if (card.type === 'vocabulary') {
      const vocab = getVocabularyItem(card.contentId);
      if (!vocab) {
        return {
          prompt: lang === 'sv'
            ? `Översätt till grekiska: ${card.contentId}`
            : `Translate to Greek: ${card.contentId}`,
          correctAnswer: card.contentId,
          acceptableAnswers: [card.contentId.toLowerCase()],
          greekText: card.contentId,
          translation: card.contentId,
          isFallback: true,
        };
      }
      return {
        prompt: lang === 'sv'
          ? `Översätt till grekiska: ${vocab.swedish}`
          : `Translate to Greek: ${vocab.english}`,
        correctAnswer: vocab.greek,
        acceptableAnswers: [vocab.greek.toLowerCase()],
        greekText: vocab.greek,
        translation: lang === 'sv' ? vocab.swedish : vocab.english,
      };
    }
    if (card.type === 'grammar') {
      const rule = getGrammarRule(card.contentId);
      if (!rule || !rule.examples[0]) {
        return {
          prompt: lang === 'sv'
            ? `Grammatik-övning: ${card.contentId}`
            : `Grammar exercise: ${card.contentId}`,
          correctAnswer: card.contentId,
          acceptableAnswers: [card.contentId.toLowerCase()],
          greekText: card.contentId,
          translation: card.contentId,
          isFallback: true,
        };
      }
      const example = rule.examples[0];
      return {
        prompt: lang === 'sv'
          ? `Översätt: ${example.translation.sv}`
          : `Translate: ${example.translation.en}`,
        correctAnswer: example.greek,
        acceptableAnswers: [example.greek.toLowerCase()],
        greekText: example.greek,
        translation: lang === 'sv' ? example.translation.sv : example.translation.en,
      };
    }
    if (card.type === 'sentence') {
      // Sentence cards: contentId may encode the sentence itself or reference vocab
      // Try vocabulary lookup first as sentence drills may reference vocab items
      const vocab = getVocabularyItem(card.contentId);
      if (vocab) {
        return {
          prompt: lang === 'sv'
            ? `Översätt meningen till grekiska: ${vocab.swedish}`
            : `Translate the sentence to Greek: ${vocab.english}`,
          correctAnswer: vocab.greek,
          acceptableAnswers: [vocab.greek.toLowerCase()],
          greekText: vocab.greek,
          translation: lang === 'sv' ? vocab.swedish : vocab.english,
        };
      }
      return {
        prompt: lang === 'sv'
          ? `Översätt till grekiska: ${card.contentId}`
          : `Translate to Greek: ${card.contentId}`,
        correctAnswer: card.contentId,
        acceptableAnswers: [card.contentId.toLowerCase()],
        greekText: card.contentId,
        translation: card.contentId,
        isFallback: true,
      };
    }
    return null;
  }, [lang]);

  const handleSubmit = useCallback(() => {
    if (!currentCard || !input.trim() || showResult) return;

    const content = getCardContent(currentCard);
    if (!content) return;

    const responseTime = Date.now() - startTime;
    const validation = checkAnswer(input, content.correctAnswer, content.acceptableAnswers);
    const rating: Rating = performanceToRating(validation.correct, responseTime, false);
    const xp = validation.correct ? calculateXP(12, combo) : 0;

    reviewCard(currentCard.id, rating);

    if (validation.correct) {
      addXP(xp);
      setTotalXP(prev => prev + xp);
      setTotalCorrect(prev => prev + 1);
      playSoundEffect('correct');
    } else {
      playSoundEffect('incorrect');
    }

    setCombo(nextCombo(combo, validation.correct));
    setLastCorrect(validation.correct);
    setShowResult(true);
  }, [currentCard, input, showResult, combo, getCardContent, reviewCard, addXP, startTime]);

  const handleNext = () => {
    if (currentIndex + 1 >= dueCards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setInput('');
      setShowResult(false);
    }
  };

  if (dueCards.length === 0 || sessionDone) {
    return (
      <div className="flex-1 pb-24">
        <div className="max-w-lg mx-auto p-4 pt-12 text-center space-y-6">
          <div className="text-6xl">{sessionDone ? '🎉' : '✨'}</div>
          <h2 className="text-2xl font-bold text-stone-900">
            {sessionDone
              ? (lang === 'sv' ? 'Repetition klar!' : 'Review Complete!')
              : (lang === 'sv' ? 'Inga kort att repetera!' : 'No cards to review!')
            }
          </h2>
          {sessionDone && (
            <div className="grid grid-cols-2 gap-4">
              <Card padding="sm" className="text-center">
                <div className="text-2xl font-bold text-amber-600">+{totalXP}</div>
                <div className="text-xs text-stone-500">XP</div>
              </Card>
              <Card padding="sm" className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((totalCorrect / dueCards.length) * 100)}%
                </div>
                <div className="text-xs text-stone-500">
                  {lang === 'sv' ? 'Precision' : 'Accuracy'}
                </div>
              </Card>
            </div>
          )}
          <p className="text-sm text-stone-500">
            {lang === 'sv'
              ? 'Bra jobbat! Kom tillbaka senare för mer repetition.'
              : 'Great work! Come back later for more review.'
            }
          </p>
          <Button onClick={() => window.location.href = '/'} fullWidth>
            {lang === 'sv' ? 'Tillbaka hem' : 'Back to home'}
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const content = getCardContent(currentCard);

  return (
    <div className="flex-1 pb-24">
      <div className="max-w-lg mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-stone-500">
            {currentIndex + 1} / {dueCards.length}
          </div>
          <ComboCounter combo={combo} />
          <StarRating stars={currentCard.masteryStars} size="sm" />
        </div>

        {content ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Prompt */}
              <Card className="text-center">
                <p className="text-lg font-medium text-stone-800">{content.prompt}</p>
              </Card>

              {/* Input */}
              {!showResult && (
                <div className="space-y-3">
                  <GreekInput
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSubmit}
                    placeholder={lang === 'sv' ? 'Skriv på grekiska...' : 'Type in Greek...'}
                    autoFocus
                    large
                  />
                  <Button onClick={handleSubmit} fullWidth disabled={!input.trim()}>
                    {lang === 'sv' ? 'Kontrollera' : 'Check'}
                  </Button>
                </div>
              )}

              {/* Result */}
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`rounded-xl p-4 ${lastCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{lastCorrect ? '✅' : '❌'}</span>
                      <span className={`font-bold ${lastCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {lastCorrect
                          ? (lang === 'sv' ? 'Rätt!' : 'Correct!')
                          : (lang === 'sv' ? 'Inte riktigt...' : 'Not quite...')
                        }
                      </span>
                    </div>
                    <div
                      className="greek-text-large text-center py-2 cursor-pointer"
                      onClick={() => speakGreek(content.greekText)}
                    >
                      {content.greekText} 🔊
                    </div>
                    {!lastCorrect && (
                      <div className="text-sm text-red-600 text-center mt-1">
                        {lang === 'sv' ? 'Du skrev: ' : 'You wrote: '}
                        <span className="greek-text">{input}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <Button onClick={handleNext} fullWidth variant={lastCorrect ? 'success' : 'primary'}>
                      {lang === 'sv' ? 'Nästa' : 'Next'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <Card className="text-center space-y-4">
            <p className="text-stone-500">
              {lang === 'sv'
                ? 'Det gick inte att ladda detta kort.'
                : 'Could not load this card.'}
            </p>
            <p className="text-xs text-stone-400">
              {currentCard.type} / {currentCard.contentId}
            </p>
            <Button onClick={handleNext} fullWidth>
              {lang === 'sv' ? 'Hoppa över' : 'Skip'}
            </Button>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
