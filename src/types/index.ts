// === Base Language Types ===
export type BaseLanguage = 'en' | 'sv';

export type BilingualText = {
  en: string;
  sv: string;
};

// === CEFR Levels ===
export type CEFRLevel = 'A1.1' | 'A1.2' | 'A2.1' | 'A2.2' | 'B1' | 'B2';

// === Curriculum Types ===

export interface World {
  id: number;
  name: BilingualText;
  cefrLevel: CEFRLevel;
  theme: string;
  themeColor: string;
  targetVocabulary: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  worldId: number;
  number: number;
  title: BilingualText;
  titleGreek: string;
  description: BilingualText;
  lessons: string[]; // lesson IDs
}

export interface Lesson {
  id: string;
  chapterId: string;
  number: number;
  title: BilingualText;
  titleGreek: string;
  estimatedMinutes: number;
  story: Story;
  grammarSpotlight: GrammarSpotlight | null;
  drills: Drill[];
  speedRound: SpeedRound;
  newVocabulary: string[];
  newGrammarIds: string[];
  idiom?: Idiom;
}

// === Story Types ===

export interface Story {
  paragraphs: StoryParagraph[];
  comprehensionQuestions: ComprehensionQuestion[];
}

export interface StoryParagraph {
  greek: string;
  english: string;
  swedish: string;
  highlightWords: string[];
  speakerNote?: string;
}

export interface ComprehensionQuestion {
  questionGreek: string;
  question: BilingualText;
  answerGreek: string;
  answer: BilingualText;
}

// === Grammar Types ===

export interface GrammarSpotlight {
  ruleId: string;
  title: BilingualText;
  explanation: BilingualText;
  buildingBlocks: BuildingBlock[];
  examples: GrammarExample[];
  tables?: GrammarTable[];
  swedishParallel?: string;
}

export interface BuildingBlock {
  step: number;
  instruction: BilingualText;
  greek: string;
  translation: BilingualText;
}

export interface GrammarExample {
  greek: string;
  translation: BilingualText;
  breakdown: { part: string; label: BilingualText }[];
}

export interface GrammarTable {
  title: BilingualText;
  headers: string[];
  rows: { label: string; cells: string[] }[];
}

export interface GrammarRule {
  id: string;
  title: BilingualText;
  titleGreek: string;
  cefrLevel: CEFRLevel;
  category: 'verb' | 'noun' | 'adjective' | 'pronoun' | 'syntax' | 'phonology' | 'article';
  prerequisiteIds: string[];
  explanation: BilingualText;
  quickReference: BilingualText;
  tables?: GrammarTable[];
  examples: GrammarExample[];
  swedishParallel?: string;
  lessonId: string;
}

// === Drill Types ===

export type DrillType =
  | 'cloze'
  | 'substitution'
  | 'transformation'
  | 'translation_g2e'
  | 'translation_e2g'
  | 'listening'
  | 'free_typing';

export interface Drill {
  id: string;
  type: DrillType;
  prompt: BilingualText;
  promptGreek?: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint?: BilingualText;
  context?: string;
  blankedWord?: string;
  sourcePattern?: string;
  targetPattern?: string;
  transformationType?: string;
  xpBase: number;
}

export interface SpeedRound {
  timeLimit: number;
  drillIds: string[];
}

// === Idiom Type ===

export interface Idiom {
  greek: string;
  literal: BilingualText;
  meaning: BilingualText;
  usage: BilingualText;
  example: {
    greek: string;
    translation: BilingualText;
  };
}

// === Vocabulary Types ===

export interface VocabularyItem {
  id: string;
  greek: string;
  greekRomanized: string;
  english: string;
  swedish: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'article' | 'particle' | 'phrase' | 'number' | 'interjection';
  gender?: 'masculine' | 'feminine' | 'neuter';
  cefrLevel: CEFRLevel;
  frequency: number;
  register?: 'formal' | 'informal' | 'slang' | 'neutral';
  exampleSentence: {
    greek: string;
    english: string;
    swedish: string;
  };
  declension?: {
    nominative: string;
    genitive: string;
    accusative: string;
    vocative?: string;
  };
  conjugation?: {
    present1s: string;
    present2s: string;
    present3s: string;
    present1p: string;
    present2p: string;
    present3p: string;
    pastSimple1s?: string;
    subjunctive1s?: string;
  };
  tags: string[];
  lessonId: string;
  domain?: string;
}

// === Alphabet Type ===

export interface AlphabetLetter {
  uppercase: string;
  lowercase: string;
  name: string;
  nameEnglish: string;
  sound: string;
  romanized: string;
  exampleWord: string;
  exampleMeaning: BilingualText;
}

export interface Digraph {
  letters: string;
  sound: string;
  romanized: string;
  exampleWord: string;
  exampleMeaning: BilingualText;
  note?: BilingualText;
}

// === FSRS / Review Types ===

export interface ReviewCard {
  id: string;
  type: 'vocabulary' | 'grammar' | 'sentence';
  contentId: string;
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: 0 | 1 | 2 | 3; // New, Learning, Review, Relearning
  last_review: string | null;
  masteryStars: number;
}

// === User Progress Types ===

export interface UserProgress {
  currentWorldId: number;
  currentChapterId: string;
  currentLessonId: string;
  completedLessonIds: string[];
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  todayLessonComplete: boolean;
  totalReviewsDone: number;
  totalCorrectAnswers: number;
  totalAnswers: number;
  totalTimeSpentSeconds: number;
  unlockedAchievementIds: string[];
  startDate: string;
  studyDays: Record<string, number>; // ISO date -> XP earned
}

export interface UserSettings {
  baseLanguage: BaseLanguage;
  showRomanization: boolean;
  enableSoundEffects: boolean;
  enableAnimations: boolean;
  onboardingComplete: boolean;
}

// === Gamification Types ===

export interface ComboState {
  count: number;
  multiplier: number;
  isActive: boolean;
}

export interface LevelDefinition {
  level: number;
  xpRequired: number;
  titleGreek: string;
  title: BilingualText;
  icon: string;
}

export interface Achievement {
  id: string;
  name: BilingualText;
  description: BilingualText;
  icon: string;
  category: 'vocabulary' | 'grammar' | 'streak' | 'progress' | 'speed' | 'accuracy' | 'domain';
  condition: {
    type: string;
    threshold: number;
  };
}

// === Answer Result ===

export interface AnswerResult {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  xpAwarded: number;
  feedback?: string;
  accentNote?: boolean;
}

// === Session Types ===

export interface LessonSession {
  lessonId: string;
  phase: 'story' | 'grammar' | 'drills' | 'speed' | 'complete';
  currentDrillIndex: number;
  answers: AnswerResult[];
  combo: ComboState;
  xpEarned: number;
  startTime: number;
  accuracy: number;
}
