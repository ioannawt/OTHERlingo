// Greek-aware answer validation
// Handles accent flexibility, sigma normalization, and common Greek input issues

const ACCENT_MAP: Record<string, string> = {
  'ά': 'α', 'έ': 'ε', 'ή': 'η', 'ί': 'ι', 'ό': 'ο', 'ύ': 'υ', 'ώ': 'ω',
  'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω',
  'ΐ': 'ϊ', 'ΰ': 'ϋ',
};

export function normalizeGreek(text: string, stripAccents = false): string {
  let normalized = text.trim().normalize('NFC');

  // Lowercase
  normalized = normalized.toLowerCase();

  // Normalize final sigma: ensure σ at word boundaries becomes ς
  normalized = normalized.replace(/σ(?=\s|$|[.,;!?·])/g, 'ς');

  // Remove all punctuation for lenient matching
  normalized = normalized.replace(/[.,;!?·:'"()\-–—…\u037E\u0387]/g, '');

  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  if (stripAccents) {
    // Strip all accent marks
    for (const [accented, plain] of Object.entries(ACCENT_MAP)) {
      normalized = normalized.replaceAll(accented.toLowerCase(), plain.toLowerCase());
    }
    // Also strip combining diacritical marks
    normalized = normalized.replace(/[\u0300-\u036f]/g, '');
  }

  return normalized;
}

export interface ValidationResult {
  correct: boolean;
  feedback?: string;
  accentNote?: boolean;
}

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string,
  acceptableAnswers?: string[]
): ValidationResult {
  if (!userAnswer.trim()) {
    return { correct: false };
  }

  const allAcceptable = [correctAnswer, ...(acceptableAnswers || [])];

  // Strict match first (with basic normalization but keeping accents)
  const normalizedUser = normalizeGreek(userAnswer);
  for (const answer of allAcceptable) {
    if (normalizeGreek(answer) === normalizedUser) {
      return { correct: true };
    }
  }

  // Lenient match: without accents
  const lenientUser = normalizeGreek(userAnswer, true);
  for (const answer of allAcceptable) {
    if (normalizeGreek(answer, true) === lenientUser) {
      return {
        correct: true,
        accentNote: true,
        feedback: correctAnswer,
      };
    }
  }

  return { correct: false };
}

// Check if a string contains Greek characters
export function containsGreek(text: string): boolean {
  return /[\u0370-\u03FF\u1F00-\u1FFF]/.test(text);
}

// Simple transliteration from Latin to Greek (for keyboard-less input)
const TRANSLIT_MAP: Record<string, string> = {
  'a': 'α', 'b': 'β', 'g': 'γ', 'd': 'δ', 'e': 'ε', 'z': 'ζ',
  'i': 'ι', 'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'x': 'ξ',
  'o': 'ο', 'p': 'π', 'r': 'ρ', 's': 'σ', 't': 'τ', 'y': 'υ',
  'f': 'φ', 'h': 'χ', 'w': 'ω',
  'th': 'θ', 'ps': 'ψ',
};

// Multi-char transliterations need to be checked first
const MULTI_TRANSLIT: [string, string][] = [
  ['th', 'θ'], ['ps', 'ψ'], ['ch', 'χ'], ['ou', 'ου'],
  ['ei', 'ει'], ['oi', 'οι'], ['ai', 'αι'], ['mp', 'μπ'],
  ['nt', 'ντ'], ['gk', 'γκ'], ['ts', 'τσ'], ['tz', 'τζ'],
];

export function transliterateToGreek(latin: string): string {
  let result = '';
  let i = 0;
  const lower = latin.toLowerCase();

  while (i < lower.length) {
    let matched = false;

    // Try multi-char transliterations first
    for (const [from, to] of MULTI_TRANSLIT) {
      if (lower.substring(i, i + from.length) === from) {
        result += to;
        i += from.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const char = lower[i];
      result += TRANSLIT_MAP[char] || char;
      i++;
    }
  }

  // Fix final sigma
  result = result.replace(/σ(?=\s|$)/g, 'ς');

  return result;
}
