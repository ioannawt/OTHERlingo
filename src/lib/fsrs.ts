import type { ReviewCard } from '@/types';

// FSRS-5 implementation (simplified but faithful to the algorithm)
// Based on the open-spaced-repetition project

const DECAY = -0.5;
const FACTOR = 0.9 ** (1 / DECAY) - 1;

// Default parameters (trained on 700M+ reviews)
const DEFAULT_W = [
  0.4072, 1.1829, 3.1262, 15.4722,   // initial stability for each rating
  7.2102, 0.5316, 1.0651, 0.0589,     // difficulty params
  1.5330, 0.1418, 1.0060,              // stability increase params
  2.0966, 0.0190, 0.3446,             // recall params
  0.6810, 2.4460, 0.1367,             // lapse params
  0.2575, 0.0000,                      // short-term params
];

const TARGET_RETENTION = 0.85;

export function createNewCard(): ReviewCard {
  return {
    id: '',
    type: 'vocabulary',
    contentId: '',
    due: new Date().toISOString(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: 0, // New
    last_review: null,
    masteryStars: 0,
  };
}

export function createReviewCard(
  type: ReviewCard['type'],
  contentId: string
): ReviewCard {
  return {
    ...createNewCard(),
    id: `card-${type}-${contentId}`,
    type,
    contentId,
  };
}

// Rating: 1=Again, 2=Hard, 3=Good, 4=Easy
export type Rating = 1 | 2 | 3 | 4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function initDifficulty(rating: Rating): number {
  return clamp(
    DEFAULT_W[4] - Math.exp(DEFAULT_W[5] * (rating - 1)) + 1,
    1,
    10
  );
}

function initStability(rating: Rating): number {
  return Math.max(DEFAULT_W[rating - 1], 0.1);
}

function nextDifficulty(d: number, rating: Rating): number {
  const newD = d - DEFAULT_W[6] * (rating - 3);
  return clamp(
    DEFAULT_W[7] * initDifficulty(3) + (1 - DEFAULT_W[7]) * newD,
    1,
    10
  );
}

function nextRecallStability(
  d: number,
  s: number,
  r: number,
  rating: Rating
): number {
  const hardPenalty = rating === 2 ? DEFAULT_W[15] : 1;
  const easyBonus = rating === 4 ? DEFAULT_W[16] : 1;
  return (
    s *
    (1 +
      Math.exp(DEFAULT_W[8]) *
        (11 - d) *
        Math.pow(s, -DEFAULT_W[9]) *
        (Math.exp((1 - r) * DEFAULT_W[10]) - 1) *
        hardPenalty *
        easyBonus)
  );
}

function nextForgetStability(d: number, s: number, r: number): number {
  return (
    DEFAULT_W[11] *
    Math.pow(d, -DEFAULT_W[12]) *
    (Math.pow(s + 1, DEFAULT_W[13]) - 1) *
    Math.exp((1 - r) * DEFAULT_W[14])
  );
}

function retrievability(elapsed: number, stability: number): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + (FACTOR * elapsed) / stability, DECAY);
}

function nextInterval(stability: number): number {
  return Math.max(
    1,
    Math.round(
      (stability / FACTOR) * (Math.pow(TARGET_RETENTION, 1 / DECAY) - 1)
    )
  );
}

export function processReview(card: ReviewCard, rating: Rating): ReviewCard {
  const now = new Date();
  const lastReview = card.last_review ? new Date(card.last_review) : now;
  const elapsedDays = card.last_review
    ? Math.max(0, (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  let newStability: number;
  let newDifficulty: number;
  let newState: ReviewCard['state'];
  let newLapses = card.lapses;

  if (card.state === 0) {
    // New card
    newDifficulty = initDifficulty(rating);
    newStability = initStability(rating);
    newState = rating === 1 ? 1 : 2; // Learning if Again, Review otherwise
    if (rating === 1) newLapses++;
  } else {
    // Review or relearning
    newDifficulty = nextDifficulty(card.difficulty, rating);
    const r = retrievability(elapsedDays, card.stability);

    if (rating === 1) {
      // Forgot
      newStability = nextForgetStability(card.difficulty, card.stability, r);
      newState = 3; // Relearning
      newLapses++;
    } else {
      // Remembered
      newStability = nextRecallStability(card.difficulty, card.stability, r, rating);
      newState = 2; // Review
    }
  }

  const interval = rating === 1 ? 1 : nextInterval(newStability);
  const dueDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  // Add some fuzz to prevent clustering
  const fuzz = Math.random() * 0.1 * interval;
  dueDate.setTime(dueDate.getTime() + fuzz * 24 * 60 * 60 * 1000);

  return {
    ...card,
    stability: newStability,
    difficulty: newDifficulty,
    elapsed_days: elapsedDays,
    scheduled_days: interval,
    reps: card.reps + 1,
    lapses: newLapses,
    state: newState,
    due: dueDate.toISOString(),
    last_review: now.toISOString(),
    masteryStars: stabilityToStars(newStability),
  };
}

export function stabilityToStars(stability: number): number {
  if (stability < 1) return 0;
  if (stability < 3) return 1;
  if (stability < 10) return 2;
  if (stability < 30) return 3;
  if (stability < 90) return 4;
  return 5;
}

export function isDue(card: ReviewCard): boolean {
  if (card.state === 0) return true; // New cards are always due
  return new Date(card.due) <= new Date();
}

export function getDueCards(cards: ReviewCard[]): ReviewCard[] {
  return cards
    .filter(isDue)
    .sort((a, b) => {
      // New cards first, then most overdue
      if (a.state === 0 && b.state !== 0) return -1;
      if (b.state === 0 && a.state !== 0) return 1;
      return new Date(a.due).getTime() - new Date(b.due).getTime();
    });
}

// Map exercise performance to FSRS rating
export function performanceToRating(
  correct: boolean,
  responseTimeMs: number,
  usedHint: boolean
): Rating {
  if (!correct) return 1; // Again
  if (usedHint) return 2; // Hard
  if (responseTimeMs < 3000) return 4; // Easy (< 3 seconds)
  return 3; // Good
}
