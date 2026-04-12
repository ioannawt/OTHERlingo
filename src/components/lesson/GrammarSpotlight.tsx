'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GrammarSpotlight as GrammarSpotlightType, BaseLanguage } from '@/types';
import { bt } from '@/lib/i18n';
import { speakGreek } from '@/lib/audio';
import { Button } from '@/components/ui/Button';

interface GrammarSpotlightProps {
  spotlight: GrammarSpotlightType;
  lang: BaseLanguage;
  onComplete: () => void;
}

export function GrammarSpotlight({ spotlight, lang, onComplete }: GrammarSpotlightProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExamples, setShowExamples] = useState(false);

  const allBlocksRevealed = currentStep >= spotlight.buildingBlocks.length;

  const handleNext = () => {
    if (currentStep < spotlight.buildingBlocks.length) {
      setCurrentStep(prev => prev + 1);
    } else if (!showExamples && spotlight.examples.length > 0) {
      setShowExamples(true);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">
          {lang === 'sv' ? 'Grammatik' : 'Grammar Bite'}
        </div>
        <h3 className="text-lg font-bold text-stone-900">{bt(spotlight.title, lang)}</h3>
      </div>

      {/* Explanation */}
      <div className="text-sm text-stone-600 leading-relaxed">
        {bt(spotlight.explanation, lang)}
      </div>

      {/* Swedish parallel note */}
      {lang === 'sv' && spotlight.swedishParallel && (
        <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-800 border border-blue-100">
          🇸🇪 {spotlight.swedishParallel}
        </div>
      )}

      {/* Building blocks */}
      <div className="space-y-2">
        {spotlight.buildingBlocks.slice(0, currentStep + 1).map((block, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-teal-50 rounded-xl px-4 py-3 border border-teal-100 animate-slide-up"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
              {block.step}
            </div>
            <div className="flex-1">
              <div className="text-sm text-teal-800">{bt(block.instruction, lang)}</div>
              <div
                className="greek-text text-teal-900 font-semibold mt-1 cursor-pointer hover:text-teal-700 transition-colors"
                onClick={() => speakGreek(block.greek)}
              >
                {block.greek} <span className="text-xs text-teal-400 ml-1">🔊</span>
              </div>
              <div className="text-xs text-teal-600 mt-0.5">{bt(block.translation, lang)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grammar tables */}
      {allBlocksRevealed && spotlight.tables && spotlight.tables.map((table, ti) => (
        <div
          key={ti}
          className="overflow-x-auto animate-slide-up"
        >
          <div className="text-xs font-semibold text-stone-500 mb-2">{bt(table.title, lang)}</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 bg-stone-100 rounded-tl-lg font-medium text-stone-600"></th>
                {table.headers.map((h, i) => (
                  <th key={i} className="text-center p-2 bg-stone-100 font-medium text-stone-600 last:rounded-tr-lg">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-stone-100">
                  <td className="p-2 text-stone-600 font-medium">{row.label}</td>
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className="p-2 text-center greek-text cursor-pointer hover:bg-teal-50 transition-colors"
                      onClick={() => speakGreek(cell)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Examples */}
      {showExamples && (
          <div
            className="space-y-3 animate-slide-up"
          >
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {lang === 'sv' ? 'Exempel' : 'Examples'}
            </div>
            {spotlight.examples.map((ex, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 p-3">
                <div
                  className="greek-text text-stone-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => speakGreek(ex.greek)}
                >
                  {ex.greek} <span className="text-xs text-stone-300 ml-1">🔊</span>
                </div>
                <div className="text-sm text-stone-500 mt-1">{bt(ex.translation, lang)}</div>
                {ex.breakdown.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ex.breakdown.map((part, j) => (
                      <span key={j} className="inline-flex items-center gap-1 text-xs bg-stone-100 px-2 py-1 rounded-lg">
                        <span className="font-semibold greek-text">{part.part}</span>
                        <span className="text-stone-500">{bt(part.label, lang)}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Next button */}
      <div className="pt-2">
        <Button
          onClick={handleNext}
          variant={showExamples || (allBlocksRevealed && spotlight.examples.length === 0) ? 'primary' : 'secondary'}
          fullWidth
        >
          {!allBlocksRevealed
            ? (lang === 'sv' ? 'Nästa steg' : 'Next step')
            : showExamples || spotlight.examples.length === 0
            ? (lang === 'sv' ? 'Fortsätt till övningar' : 'Continue to drills')
            : (lang === 'sv' ? 'Se exempel' : 'See examples')
          }
        </Button>
      </div>
    </div>
  );
}
