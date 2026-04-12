'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Story, BaseLanguage } from '@/types';
import { bt } from '@/lib/i18n';
import { speakGreek } from '@/lib/audio';
import { Button } from '@/components/ui/Button';

interface StoryPanelProps {
  story: Story;
  lang: BaseLanguage;
  showRomanization?: boolean;
  onComplete: () => void;
}

export function StoryPanel({ story, lang, onComplete }: StoryPanelProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [showComprehension, setShowComprehension] = useState(false);

  const paragraphs = story.paragraphs;
  const allRevealed = currentParagraph >= paragraphs.length;

  const handleNext = () => {
    if (currentParagraph < paragraphs.length) {
      setCurrentParagraph(prev => prev + 1);
    } else if (!showComprehension && story.comprehensionQuestions.length > 0) {
      setShowComprehension(true);
    } else {
      onComplete();
    }
  };

  const handleSpeak = (text: string) => {
    speakGreek(text);
  };

  return (
    <div className="space-y-4">
      {/* Story header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
          {lang === 'sv' ? 'Berättelse' : 'Story'}
        </h3>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {showTranslation
            ? (lang === 'sv' ? 'Dölj översättning' : 'Hide translation')
            : (lang === 'sv' ? 'Visa översättning' : 'Show translation')
          }
        </button>
      </div>

      {/* Paragraphs */}
      <div className="space-y-4">
        {paragraphs.slice(0, currentParagraph + 1).map((para, i) => (
          <div
            key={i}
            className="group animate-slide-up"
          >
            {para.speakerNote && (
              <div className="text-xs text-stone-400 italic mb-1">{para.speakerNote}</div>
            )}

            {/* Greek text */}
            <div
              className="greek-text text-stone-900 cursor-pointer hover:bg-blue-50/50 rounded-lg p-2 -mx-2 transition-colors"
              onClick={() => handleSpeak(para.greek)}
            >
              {para.greek}
              <span className="ml-2 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                🔊
              </span>
            </div>

            {/* Translation */}
            <AnimatePresence>
              {showTranslation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-stone-500 mt-1 pl-2 border-l-2 border-stone-200"
                >
                  {lang === 'sv' ? para.swedish : para.english}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Comprehension questions */}
      <AnimatePresence>
        {showComprehension && story.comprehensionQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-xl p-4 space-y-3"
          >
            <div className="text-sm font-semibold text-blue-800">
              {lang === 'sv' ? 'Förstod du?' : 'Did you understand?'}
            </div>
            {story.comprehensionQuestions.map((q, i) => (
              <div key={i} className="text-sm">
                <div className="greek-text text-blue-900 font-medium">{q.questionGreek}</div>
                <div className="text-blue-700 mt-0.5">{bt(q.question, lang)}</div>
                <div className="text-blue-600 mt-1 text-xs italic">
                  {q.answerGreek} — {bt(q.answer, lang)}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next button */}
      <div className="pt-2">
        <Button
          onClick={handleNext}
          variant={allRevealed ? 'primary' : 'ghost'}
          fullWidth
        >
          {!allRevealed
            ? (lang === 'sv' ? 'Nästa' : 'Next')
            : showComprehension || story.comprehensionQuestions.length === 0
            ? (lang === 'sv' ? 'Fortsätt' : 'Continue')
            : (lang === 'sv' ? 'Kontrollera förståelse' : 'Check understanding')
          }
        </Button>
      </div>
    </div>
  );
}
