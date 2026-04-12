import type { BaseLanguage, BilingualText } from '@/types';
import en from '@/data/i18n/en.json';
import sv from '@/data/i18n/sv.json';

type TranslationKeys = typeof en;

const translations: Record<BaseLanguage, TranslationKeys> = { en, sv };

export function t(key: keyof TranslationKeys, lang: BaseLanguage): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function bt(text: BilingualText, lang: BaseLanguage): string {
  return text[lang] || text.en;
}
