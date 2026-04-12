'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { getAlphabet } from '@/lib/curriculum';
import { bt } from '@/lib/i18n';
import { speakGreek } from '@/lib/audio';
import { Card } from '@/components/ui/Card';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function AlphabetPage() {
  const lang = useStore(s => s.settings.baseLanguage);
  const { letters, digraphs } = getAlphabet();
  const [activeTab, setActiveTab] = useState<'letters' | 'digraphs' | 'iotacism'>('letters');

  const iotacismLetters = ['η', 'ι', 'υ', 'ει', 'οι', 'υι'];

  return (
    <div className="flex-1 pb-24">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">
          {lang === 'sv' ? 'Grekiska alfabetet' : 'Greek Alphabet'}
        </h1>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'letters' as const, label: lang === 'sv' ? 'Bokstäver' : 'Letters' },
            { id: 'digraphs' as const, label: lang === 'sv' ? 'Digrafer' : 'Digraphs' },
            { id: 'iotacism' as const, label: 'Iotacism' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Letters grid */}
        {activeTab === 'letters' && (
          <div className="grid grid-cols-4 gap-2">
            {letters.map((letter, i) => (
              <motion.div
                key={letter.nameEnglish}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <Card
                  padding="sm"
                  className="text-center cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakGreek(letter.name)}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-bold text-stone-900">{letter.uppercase}</span>
                    <span className="text-2xl text-stone-400">{letter.lowercase}</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{letter.nameEnglish}</div>
                  <div className="text-[10px] text-blue-600 font-medium">[{letter.sound}]</div>
                  <div className="text-[10px] text-stone-400">{letter.romanized}</div>
                  <div className="text-xs text-stone-600 mt-1 border-t border-stone-100 pt-1">
                    <span className="greek-text">{letter.exampleWord}</span>
                    <div className="text-[9px] text-stone-400">{bt(letter.exampleMeaning, lang)}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Digraphs */}
        {activeTab === 'digraphs' && (
          <div className="space-y-2">
            {digraphs.map((digraph, i) => (
              <motion.div
                key={digraph.letters}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  padding="sm"
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakGreek(digraph.exampleWord)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-stone-900 greek-text w-12 text-center">{digraph.letters}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600 font-medium">[{digraph.sound}]</span>
                        <span className="text-xs text-stone-400">= {digraph.romanized}</span>
                      </div>
                      <div className="text-sm text-stone-600 mt-0.5">
                        <span className="greek-text">{digraph.exampleWord}</span>
                        <span className="text-stone-400 ml-2">({bt(digraph.exampleMeaning, lang)})</span>
                      </div>
                      {digraph.note && (
                        <div className="text-xs text-stone-400 mt-0.5">{bt(digraph.note, lang)}</div>
                      )}
                    </div>
                    <span className="text-stone-300">🔊</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Iotacism */}
        {activeTab === 'iotacism' && (
          <div className="space-y-4">
            <Card className="!bg-amber-50 !border-amber-200">
              <div className="text-sm text-amber-800">
                {lang === 'sv'
                  ? '⚠️ I modern grekiska låter 6 olika stavningar som [i]. Detta kallas iotacism och är den största stavningsutmaningen!'
                  : '⚠️ In Modern Greek, 6 different spellings all sound like [i]. This is called iotacism and is the biggest spelling challenge!'}
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              {iotacismLetters.map(letter => (
                <Card
                  key={letter}
                  padding="sm"
                  className="text-center cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakGreek(letter)}
                >
                  <div className="text-3xl font-bold greek-text text-stone-900">{letter}</div>
                  <div className="text-xs text-blue-600 font-medium mt-1">[i]</div>
                </Card>
              ))}
            </div>

            <Card>
              <div className="text-sm text-stone-700 space-y-2">
                <p className="font-semibold">{lang === 'sv' ? 'Tips:' : 'Tip:'}</p>
                <p>{lang === 'sv'
                  ? 'Du kan inte höra skillnaden — du måste lära dig stavningen genom läsning och övning!'
                  : "You can't hear the difference — you need to learn the spelling through reading and practice!"}
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
