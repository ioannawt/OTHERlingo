'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { speakGreek } from '@/lib/audio';
import { Card } from '@/components/ui/Card';
import { BottomNav } from '@/components/navigation/BottomNav';

interface Word {
  greek: string;
  en: string;
  sv: string;
}

interface Category {
  id: string;
  titleEn: string;
  titleSv: string;
  icon: string;
  color: string;
  words: Word[];
}

const categories: Category[] = [
  {
    id: 'greetings',
    titleEn: 'Greetings',
    titleSv: 'Hälsningar',
    icon: '👋',
    color: 'from-purple-500 to-fuchsia-500',
    words: [
      { greek: 'γεια', en: 'hi / bye', sv: 'hej / hejdå' },
      { greek: 'γεια σου', en: 'hello (informal)', sv: 'hej (informellt)' },
      { greek: 'γεια σας', en: 'hello (formal)', sv: 'hej (formellt)' },
      { greek: 'καλημέρα', en: 'good morning', sv: 'god morgon' },
      { greek: 'καλησπέρα', en: 'good evening', sv: 'god kväll' },
      { greek: 'καληνύχτα', en: 'good night', sv: 'god natt' },
      { greek: 'αντίο', en: 'goodbye', sv: 'adjö' },
      { greek: 'ευχαριστώ', en: 'thank you', sv: 'tack' },
      { greek: 'παρακαλώ', en: 'please / you\'re welcome', sv: 'snälla / varsågod' },
      { greek: 'συγγνώμη', en: 'excuse me / sorry', sv: 'ursäkta / förlåt' },
      { greek: 'ναι', en: 'yes', sv: 'ja' },
      { greek: 'όχι', en: 'no', sv: 'nej' },
    ],
  },
  {
    id: 'numbers',
    titleEn: 'Numbers',
    titleSv: 'Siffror',
    icon: '🔢',
    color: 'from-blue-500 to-cyan-500',
    words: [
      { greek: 'ένα', en: 'one', sv: 'ett' },
      { greek: 'δύο', en: 'two', sv: 'två' },
      { greek: 'τρία', en: 'three', sv: 'tre' },
      { greek: 'τέσσερα', en: 'four', sv: 'fyra' },
      { greek: 'πέντε', en: 'five', sv: 'fem' },
      { greek: 'έξι', en: 'six', sv: 'sex' },
      { greek: 'εφτά', en: 'seven', sv: 'sju' },
      { greek: 'οχτώ', en: 'eight', sv: 'åtta' },
      { greek: 'εννιά', en: 'nine', sv: 'nio' },
      { greek: 'δέκα', en: 'ten', sv: 'tio' },
    ],
  },
  {
    id: 'cafe',
    titleEn: 'At the Cafe',
    titleSv: 'På kaféet',
    icon: '☕',
    color: 'from-amber-500 to-orange-500',
    words: [
      { greek: 'καφές', en: 'coffee', sv: 'kaffe' },
      { greek: 'τσάι', en: 'tea', sv: 'te' },
      { greek: 'νερό', en: 'water', sv: 'vatten' },
      { greek: 'ψωμί', en: 'bread', sv: 'bröd' },
      { greek: 'τυρί', en: 'cheese', sv: 'ost' },
      { greek: 'σαλάτα', en: 'salad', sv: 'sallad' },
      { greek: 'κρασί', en: 'wine', sv: 'vin' },
      { greek: 'μπύρα', en: 'beer', sv: 'öl' },
      { greek: 'γάλα', en: 'milk', sv: 'mjölk' },
      { greek: 'ζάχαρη', en: 'sugar', sv: 'socker' },
      { greek: 'λογαριασμός', en: 'the bill', sv: 'notan' },
      { greek: 'μενού', en: 'menu', sv: 'meny' },
    ],
  },
  {
    id: 'transport',
    titleEn: 'Getting Around',
    titleSv: 'Transport',
    icon: '🚌',
    color: 'from-teal-500 to-emerald-500',
    words: [
      { greek: 'ταξί', en: 'taxi', sv: 'taxi' },
      { greek: 'λεωφορείο', en: 'bus', sv: 'buss' },
      { greek: 'στάση', en: 'stop / station', sv: 'hållplats' },
      { greek: 'μετρό', en: 'metro', sv: 'tunnelbana' },
      { greek: 'αεροδρόμιο', en: 'airport', sv: 'flygplats' },
      { greek: 'δρόμος', en: 'road / street', sv: 'gata / väg' },
      { greek: 'πλατεία', en: 'square / plaza', sv: 'torg' },
      { greek: 'εισιτήριο', en: 'ticket', sv: 'biljett' },
      { greek: 'χάρτης', en: 'map', sv: 'karta' },
      { greek: 'ξενοδοχείο', en: 'hotel', sv: 'hotell' },
    ],
  },
  {
    id: 'verbs',
    titleEn: 'Essential Verbs',
    titleSv: 'Viktiga verb',
    icon: '🏃',
    color: 'from-rose-500 to-pink-500',
    words: [
      { greek: 'είμαι', en: 'I am', sv: 'jag är' },
      { greek: 'έχω', en: 'I have', sv: 'jag har' },
      { greek: 'θέλω', en: 'I want', sv: 'jag vill' },
      { greek: 'πάω', en: 'I go', sv: 'jag går' },
      { greek: 'μπορώ', en: 'I can', sv: 'jag kan' },
      { greek: 'ξέρω', en: 'I know', sv: 'jag vet' },
      { greek: 'μιλάω', en: 'I speak', sv: 'jag pratar' },
      { greek: 'καταλαβαίνω', en: 'I understand', sv: 'jag förstår' },
      { greek: 'τρώω', en: 'I eat', sv: 'jag äter' },
      { greek: 'πίνω', en: 'I drink', sv: 'jag dricker' },
      { greek: 'βλέπω', en: 'I see', sv: 'jag ser' },
      { greek: 'ακούω', en: 'I hear', sv: 'jag hör' },
    ],
  },
];

export default function VocabularyPage() {
  const lang = useStore(s => s.settings.baseLanguage);
  const [activeCategory, setActiveCategory] = useState<string>('greetings');

  const current = categories.find(c => c.id === activeCategory) ?? categories[0];

  return (
    <div className="flex-1 pb-24">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Back link */}
        <Link href="/more" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors">
          <span>←</span>
          <span>{lang === 'sv' ? 'Tillbaka' : 'Back'}</span>
        </Link>

        <h1 className="text-2xl font-bold text-stone-900">
          {lang === 'sv' ? 'Ordbank' : 'Vocabulary Bank'}
        </h1>
        <p className="text-sm text-stone-500">
          {lang === 'sv'
            ? 'Tryck på ett ord för att höra uttalet'
            : 'Tap a word to hear it spoken'}
        </p>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{lang === 'sv' ? cat.titleSv : cat.titleEn}</span>
            </button>
          ))}
        </div>

        {/* Category header */}
        <div className={`bg-gradient-to-r ${current.color} rounded-xl p-4 text-white`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{current.icon}</span>
            <div>
              <h2 className="font-bold text-lg">{lang === 'sv' ? current.titleSv : current.titleEn}</h2>
              <p className="text-white/80 text-xs">
                {current.words.length} {lang === 'sv' ? 'ord' : 'words'}
              </p>
            </div>
          </div>
        </div>

        {/* Word list */}
        <div className="space-y-2">
          {current.words.map((word, i) => (
            <Card
              key={`${current.id}-${i}`}
              padding="sm"
              onClick={() => speakGreek(word.greek)}
              className="hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-lg font-semibold text-stone-900 greek-text">{word.greek}</span>
                  <div className="text-sm text-stone-500 mt-0.5">
                    {lang === 'sv' ? word.sv : word.en}
                  </div>
                </div>
                <span className="text-purple-400 text-lg ml-2">🔊</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
