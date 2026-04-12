'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { BottomNav } from '@/components/navigation/BottomNav';

const sections = [
  {
    href: '/alphabet',
    icon: '🔤',
    titleEn: 'Greek Alphabet',
    titleSv: 'Grekiska alfabetet',
    descEn: 'All 24 letters, digraphs & iotacism',
    descSv: 'Alla 24 bokstäver, digrafer & iotacism',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    href: '/grammar',
    icon: '📐',
    titleEn: 'Grammar Reference',
    titleSv: 'Grammatikreferens',
    descEn: 'Verb conjugations, articles, pronouns & more',
    descSv: 'Verbkonjugationer, artiklar, pronomen & mer',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    href: '/more/vocabulary',
    icon: '📚',
    titleEn: 'Vocabulary Bank',
    titleSv: 'Ordbank',
    descEn: 'All words you\'ve learned, organized by topic',
    descSv: 'Alla ord du har l\u00e4rt dig, sorterade efter \u00e4mne',
    color: 'from-purple-500 to-fuchsia-500',
  },
  {
    href: '/more/phrasebook',
    icon: '💬',
    titleEn: 'Phrasebook',
    titleSv: 'Parlör',
    descEn: 'Essential phrases for daily life in Greece',
    descSv: 'Viktiga fraser för vardagen i Grekland',
    color: 'from-amber-500 to-orange-500',
  },
  {
    href: '/more/tips',
    icon: '💡',
    titleEn: 'Study Tips',
    titleSv: 'Studietips',
    descEn: 'How to learn Greek effectively',
    descSv: 'Hur du lär dig grekiska effektivt',
    color: 'from-rose-500 to-pink-500',
  },
  {
    href: '/settings',
    icon: '⚙️',
    titleEn: 'Settings',
    titleSv: 'Inställningar',
    descEn: 'Language, sounds, reset progress',
    descSv: 'Språk, ljud, återställ framsteg',
    color: 'from-stone-400 to-stone-500',
  },
];

export default function MorePage() {
  const lang = useStore(s => s.settings.baseLanguage);

  return (
    <div className="flex-1 pb-24">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">
          {lang === 'sv' ? 'Mer' : 'More'}
        </h1>

        <div className="space-y-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-stone-900">
                  {lang === 'sv' ? section.titleSv : section.titleEn}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {lang === 'sv' ? section.descSv : section.descEn}
                </div>
              </div>
              <span className="text-stone-300 text-sm">›</span>
            </Link>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
