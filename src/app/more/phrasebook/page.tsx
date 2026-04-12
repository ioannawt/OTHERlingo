'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { speakGreek } from '@/lib/audio';
import { Card } from '@/components/ui/Card';
import { BottomNav } from '@/components/navigation/BottomNav';

interface Phrase {
  greek: string;
  romanized: string;
  en: string;
  sv: string;
}

interface Situation {
  id: string;
  titleEn: string;
  titleSv: string;
  icon: string;
  color: string;
  phrases: Phrase[];
}

const situations: Situation[] = [
  {
    id: 'basics',
    titleEn: 'Greetings & Basics',
    titleSv: 'Hälsningar & Grundläggande',
    icon: '👋',
    color: 'from-amber-500 to-orange-500',
    phrases: [
      { greek: 'Γεια σου!', romanized: 'Ya su!', en: 'Hello!', sv: 'Hej!' },
      { greek: 'Αντίο!', romanized: 'Adío!', en: 'Goodbye!', sv: 'Hejdå!' },
      { greek: 'Ευχαριστώ.', romanized: 'Efcharistó.', en: 'Thank you.', sv: 'Tack.' },
      { greek: 'Παρακαλώ.', romanized: 'Parakaló.', en: 'Please. / You\'re welcome.', sv: 'Snälla. / Varsågod.' },
      { greek: 'Συγγνώμη.', romanized: 'Signómi.', en: 'Excuse me. / Sorry.', sv: 'Ursäkta. / Förlåt.' },
      { greek: 'Ναι.', romanized: 'Ne.', en: 'Yes.', sv: 'Ja.' },
      { greek: 'Όχι.', romanized: 'Óchi.', en: 'No.', sv: 'Nej.' },
      { greek: 'Δεν καταλαβαίνω.', romanized: 'Den katalavéno.', en: 'I don\'t understand.', sv: 'Jag förstår inte.' },
      { greek: 'Μιλάτε αγγλικά;', romanized: 'Miláte angliká?', en: 'Do you speak English?', sv: 'Talar du engelska?' },
      { greek: 'Με λένε...', romanized: 'Me léne...', en: 'My name is...', sv: 'Jag heter...' },
    ],
  },
  {
    id: 'restaurant',
    titleEn: 'At a Restaurant',
    titleSv: 'På restaurangen',
    icon: '🍽️',
    color: 'from-rose-500 to-pink-500',
    phrases: [
      { greek: 'Ένα τραπέζι για δύο, παρακαλώ.', romanized: 'Éna trapézi ya dío, parakaló.', en: 'A table for two, please.', sv: 'Ett bord för två, tack.' },
      { greek: 'Τον κατάλογο, παρακαλώ.', romanized: 'Ton katálogo, parakaló.', en: 'The menu, please.', sv: 'Menyn, tack.' },
      { greek: 'Θα ήθελα...', romanized: 'Tha íthela...', en: 'I would like...', sv: 'Jag skulle vilja ha...' },
      { greek: 'Τον λογαριασμό, παρακαλώ.', romanized: 'Ton logariasmó, parakaló.', en: 'The bill, please.', sv: 'Notan, tack.' },
      { greek: 'Ήταν πολύ νόστιμο!', romanized: 'Ítan polí nóstimo!', en: 'It was delicious!', sv: 'Det var jättegott!' },
      { greek: 'Ένα νερό, παρακαλώ.', romanized: 'Éna neró, parakaló.', en: 'A water, please.', sv: 'Ett vatten, tack.' },
      { greek: 'Χωρίς κρέας.', romanized: 'Chorís kréas.', en: 'Without meat.', sv: 'Utan kött.' },
      { greek: 'Τι μας προτείνετε;', romanized: 'Ti mas protínete?', en: 'What do you recommend?', sv: 'Vad rekommenderar ni?' },
    ],
  },
  {
    id: 'shopping',
    titleEn: 'Shopping',
    titleSv: 'Shopping',
    icon: '🛍️',
    color: 'from-purple-500 to-fuchsia-500',
    phrases: [
      { greek: 'Πόσο κάνει αυτό;', romanized: 'Póso káni aftó?', en: 'How much is this?', sv: 'Hur mycket kostar det här?' },
      { greek: 'Πολύ ακριβό.', romanized: 'Polí akrivó.', en: 'Too expensive.', sv: 'För dyrt.' },
      { greek: 'Έχετε...;', romanized: 'Échete...?', en: 'Do you have...?', sv: 'Har ni...?' },
      { greek: 'Θα το πάρω.', romanized: 'Tha to páro.', en: 'I\'ll take it.', sv: 'Jag tar den.' },
      { greek: 'Απλά κοιτάζω.', romanized: 'Aplá kitázo.', en: 'Just looking.', sv: 'Jag tittar bara.' },
      { greek: 'Μπορώ να πληρώσω με κάρτα;', romanized: 'Boró na pliróso me kárta?', en: 'Can I pay by card?', sv: 'Kan jag betala med kort?' },
    ],
  },
  {
    id: 'directions',
    titleEn: 'Directions',
    titleSv: 'Vägbeskrivningar',
    icon: '🧭',
    color: 'from-teal-500 to-emerald-500',
    phrases: [
      { greek: 'Πού είναι...;', romanized: 'Pú íne...?', en: 'Where is...?', sv: 'Var är...?' },
      { greek: 'Αριστερά.', romanized: 'Aristerá.', en: 'Left.', sv: 'Vänster.' },
      { greek: 'Δεξιά.', romanized: 'Dexiá.', en: 'Right.', sv: 'Höger.' },
      { greek: 'Ευθεία.', romanized: 'Efthía.', en: 'Straight ahead.', sv: 'Rakt fram.' },
      { greek: 'Πόσο μακριά;', romanized: 'Póso makriá?', en: 'How far?', sv: 'Hur långt?' },
      { greek: 'Κοντά.', romanized: 'Kondá.', en: 'Near.', sv: 'Nära.' },
      { greek: 'Μακριά.', romanized: 'Makriá.', en: 'Far.', sv: 'Långt bort.' },
      { greek: 'Πού είναι η τουαλέτα;', romanized: 'Pú íne i tualéta?', en: 'Where is the bathroom?', sv: 'Var är toaletten?' },
    ],
  },
  {
    id: 'emergency',
    titleEn: 'Emergency',
    titleSv: 'Nödsituationer',
    icon: '🚨',
    color: 'from-red-500 to-red-600',
    phrases: [
      { greek: 'Βοήθεια!', romanized: 'Voíthia!', en: 'Help!', sv: 'Hjälp!' },
      { greek: 'Χρειάζομαι γιατρό.', romanized: 'Chriázome yatró.', en: 'I need a doctor.', sv: 'Jag behöver en läkare.' },
      { greek: 'Καλέστε την αστυνομία.', romanized: 'Kaléste tin astinomía.', en: 'Call the police.', sv: 'Ring polisen.' },
      { greek: 'Έχασα τον δρόμο μου.', romanized: 'Échasa ton drómo mu.', en: 'I\'m lost.', sv: 'Jag har gått vilse.' },
      { greek: 'Χρειάζομαι βοήθεια.', romanized: 'Chriázome voíthia.', en: 'I need help.', sv: 'Jag behöver hjälp.' },
      { greek: 'Είναι επείγον.', romanized: 'Íne epígon.', en: 'It\'s urgent.', sv: 'Det är brådskande.' },
    ],
  },
];

export default function PhrasebookPage() {
  const lang = useStore(s => s.settings.baseLanguage);
  const [activeSituation, setActiveSituation] = useState<string>('basics');

  const current = situations.find(s => s.id === activeSituation) ?? situations[0];

  return (
    <div className="flex-1 pb-24">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Back link */}
        <Link href="/more" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors">
          <span>←</span>
          <span>{lang === 'sv' ? 'Tillbaka' : 'Back'}</span>
        </Link>

        <h1 className="text-2xl font-bold text-stone-900">
          {lang === 'sv' ? 'Parlör' : 'Phrasebook'}
        </h1>
        <p className="text-sm text-stone-500">
          {lang === 'sv'
            ? 'Viktiga fraser för vardagen i Grekland'
            : 'Essential phrases for daily life in Greece'}
        </p>

        {/* Situation filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {situations.map(sit => (
            <button
              key={sit.id}
              onClick={() => setActiveSituation(sit.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeSituation === sit.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{sit.icon}</span>
              <span>{lang === 'sv' ? sit.titleSv : sit.titleEn}</span>
            </button>
          ))}
        </div>

        {/* Situation header */}
        <div className={`bg-gradient-to-r ${current.color} rounded-xl p-4 text-white`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{current.icon}</span>
            <div>
              <h2 className="font-bold text-lg">{lang === 'sv' ? current.titleSv : current.titleEn}</h2>
              <p className="text-white/80 text-xs">
                {current.phrases.length} {lang === 'sv' ? 'fraser' : 'phrases'}
              </p>
            </div>
          </div>
        </div>

        {/* Phrase list */}
        <div className="space-y-2">
          {current.phrases.map((phrase, i) => (
            <Card
              key={`${current.id}-${i}`}
              padding="sm"
              onClick={() => speakGreek(phrase.greek)}
              className="hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-stone-900 greek-text">{phrase.greek}</div>
                  <div className="text-xs text-stone-400 italic mt-0.5">{phrase.romanized}</div>
                  <div className="text-sm text-stone-600 mt-1">
                    {lang === 'sv' ? phrase.sv : phrase.en}
                  </div>
                </div>
                <span className="text-orange-400 text-lg mt-1 flex-shrink-0">🔊</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
