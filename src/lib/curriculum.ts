import type { Lesson, World, Chapter, VocabularyItem, GrammarRule, Achievement, AlphabetLetter, Digraph } from '@/types';

// Static imports for curriculum data — Chapter 1: First Words
import w1c1l1 from '@/data/curriculum/world-1/chapter-1/lesson-1.json';
import w1c1l2 from '@/data/curriculum/world-1/chapter-1/lesson-2.json';
import w1c1l3 from '@/data/curriculum/world-1/chapter-1/lesson-3.json';
import w1c1l4 from '@/data/curriculum/world-1/chapter-1/lesson-4.json';
import w1c1l5 from '@/data/curriculum/world-1/chapter-1/lesson-5.json';
import w1c1l6 from '@/data/curriculum/world-1/chapter-1/lesson-6.json';

// Chapter 2: Hello!
import w1c2l1 from '@/data/curriculum/world-1/chapter-2/lesson-1.json';
import w1c2l2 from '@/data/curriculum/world-1/chapter-2/lesson-2.json';
import w1c2l3 from '@/data/curriculum/world-1/chapter-2/lesson-3.json';
import w1c2l4 from '@/data/curriculum/world-1/chapter-2/lesson-4.json';
import w1c2l5 from '@/data/curriculum/world-1/chapter-2/lesson-5.json';
import w1c2l6 from '@/data/curriculum/world-1/chapter-2/lesson-6.json';

import vocabularyData from '@/data/vocabulary/a1-vocabulary.json';
import grammarData from '@/data/grammar/a1-grammar.json';
import achievementsData from '@/data/achievements.json';
import alphabetData from '@/data/alphabet.json';

// Lesson registry
const lessonMap: Record<string, Lesson> = {
  // Chapter 1: First Words
  'w1-c1-l1': w1c1l1 as unknown as Lesson,
  'w1-c1-l2': w1c1l2 as unknown as Lesson,
  'w1-c1-l3': w1c1l3 as unknown as Lesson,
  'w1-c1-l4': w1c1l4 as unknown as Lesson,
  'w1-c1-l5': w1c1l5 as unknown as Lesson,
  'w1-c1-l6': w1c1l6 as unknown as Lesson,
  // Chapter 2: Hello!
  'w1-c2-l1': w1c2l1 as unknown as Lesson,
  'w1-c2-l2': w1c2l2 as unknown as Lesson,
  'w1-c2-l3': w1c2l3 as unknown as Lesson,
  'w1-c2-l4': w1c2l4 as unknown as Lesson,
  'w1-c2-l5': w1c2l5 as unknown as Lesson,
  'w1-c2-l6': w1c2l6 as unknown as Lesson,
};

const allLessonIds = Object.keys(lessonMap);

// World data
export const worlds: World[] = [
  {
    id: 1,
    name: { en: 'Arrival', sv: 'Ankomst' },
    cefrLevel: 'A1.1',
    theme: 'greek-islands',
    themeColor: '#3b82f6',
    targetVocabulary: 300,
    chapters: [
      {
        id: 'w1-c1',
        worldId: 1,
        number: 1,
        title: { en: 'First Words', sv: 'Första orden' },
        titleGreek: 'Πρώτες λέξεις',
        description: {
          en: 'Learn the Greek alphabet and your very first words. Start reading Greek from day one!',
          sv: 'Lär dig det grekiska alfabetet och dina allra första ord. Börja läsa grekiska från dag ett!',
        },
        lessons: ['w1-c1-l1', 'w1-c1-l2', 'w1-c1-l3', 'w1-c1-l4', 'w1-c1-l5', 'w1-c1-l6'],
      },
      {
        id: 'w1-c2',
        worldId: 1,
        number: 2,
        title: { en: 'Hello!', sv: 'Hej!' },
        titleGreek: 'Γεια σου!',
        description: {
          en: 'Introduce yourself, meet people, and have your first conversations in Greek.',
          sv: 'Presentera dig, träffa människor och ha dina första samtal på grekiska.',
        },
        lessons: ['w1-c2-l1', 'w1-c2-l2', 'w1-c2-l3', 'w1-c2-l4', 'w1-c2-l5', 'w1-c2-l6'],
      },
    ],
  },
  {
    id: 2,
    name: { en: 'Daily Life', sv: 'Vardagsliv' },
    cefrLevel: 'A1.2',
    theme: 'taverna',
    themeColor: '#c2410c',
    targetVocabulary: 600,
    chapters: [],
  },
  {
    id: 3,
    name: { en: 'Connections', sv: 'Förbindelser' },
    cefrLevel: 'A2.1',
    theme: 'ancient-ruins',
    themeColor: '#ca8a04',
    targetVocabulary: 1200,
    chapters: [],
  },
  {
    id: 4,
    name: { en: 'City Life', sv: 'Stadsliv' },
    cefrLevel: 'A2.2',
    theme: 'athens',
    themeColor: '#4f46e5',
    targetVocabulary: 2000,
    chapters: [],
  },
  {
    id: 5,
    name: { en: 'Deeper', sv: 'Djupare' },
    cefrLevel: 'B1',
    theme: 'thessaloniki',
    themeColor: '#0891b2',
    targetVocabulary: 3500,
    chapters: [],
  },
  {
    id: 6,
    name: { en: 'Fluency', sv: 'Flyt' },
    cefrLevel: 'B2',
    theme: 'olympus',
    themeColor: '#7c3aed',
    targetVocabulary: 5000,
    chapters: [],
  },
];

// Getters
export function getLesson(id: string): Lesson | undefined {
  return lessonMap[id];
}

export function getWorld(id: number): World | undefined {
  return worlds.find(w => w.id === id);
}

export function getChapter(id: string): Chapter | undefined {
  for (const world of worlds) {
    const chapter = world.chapters.find(c => c.id === id);
    if (chapter) return chapter;
  }
  return undefined;
}

export function getNextLessonId(currentId: string): string | null {
  const idx = allLessonIds.indexOf(currentId);
  if (idx === -1 || idx >= allLessonIds.length - 1) return null;
  return allLessonIds[idx + 1];
}

export function getAllLessonIds(): string[] {
  return [...allLessonIds];
}

export function getLessonCount(): number {
  return allLessonIds.length;
}

// Vocabulary
const vocabMap = new Map<string, VocabularyItem>();
(vocabularyData as unknown as VocabularyItem[]).forEach(v => vocabMap.set(v.id, v));

export function getVocabularyItem(id: string): VocabularyItem | undefined {
  return vocabMap.get(id);
}

export function getVocabularyForLesson(lessonId: string): VocabularyItem[] {
  return (vocabularyData as unknown as VocabularyItem[]).filter(v => v.lessonId === lessonId);
}

export function getAllVocabulary(): VocabularyItem[] {
  return vocabularyData as unknown as VocabularyItem[];
}

// Grammar
const grammarMap = new Map<string, GrammarRule>();
(grammarData as unknown as GrammarRule[]).forEach(g => grammarMap.set(g.id, g));

export function getGrammarRule(id: string): GrammarRule | undefined {
  return grammarMap.get(id);
}

export function getAllGrammarRules(): GrammarRule[] {
  return grammarData as unknown as GrammarRule[];
}

// Achievements
export function getAllAchievements(): Achievement[] {
  return achievementsData as unknown as Achievement[];
}

export function getAchievement(id: string): Achievement | undefined {
  return (achievementsData as unknown as Achievement[]).find(a => a.id === id);
}

// Alphabet
export function getAlphabet(): { letters: AlphabetLetter[]; digraphs: Digraph[] } {
  const data = alphabetData as { letters: AlphabetLetter[]; digraphs: Digraph[] };
  return data;
}
