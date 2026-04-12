'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { BottomNav } from '@/components/navigation/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

interface Tip {
  id: string;
  icon: string;
  color: string;
  titleEn: string;
  titleSv: string;
  hookEn: string;
  hookSv: string;
  bodyEn: string;
  bodySv: string;
  svOnly?: boolean;
}

const tips: Tip[] = [
  {
    id: 'sounds',
    icon: '🗣️',
    color: 'from-blue-500 to-cyan-500',
    titleEn: 'The Greek Sound System',
    titleSv: 'Det grekiska ljudsystemet',
    hookEn: 'Greek sounds are more consistent than English - once you learn the rules, you can read anything.',
    hookSv: 'Grekiska ljud är mer konsekventa än engelska - när du kan reglerna kan du läsa allt.',
    bodyEn: 'Greek has 5 vowel sounds (a, e, i, o, u) - fewer than English or Swedish. Consonants are mostly familiar, with a few new ones: the soft "th" (θ) as in "think", the hard "th" (δ) as in "this", the guttural "ch" (χ) like the Scottish "loch", and the rolling "r" (ρ). The letter γ (gamma) before e/i sounds like a soft "y". The combination μπ sounds like "b", ντ like "d", and γκ like "g" at the start of words.',
    bodySv: 'Grekiska har 5 vokalljud (a, e, i, o, u) - färre än svenska. Konsonanterna är mestadels bekanta, med några nya: det mjuka "th" (θ) som i engelska "think", det hårda "th" (δ) som i "this", det gutturala "ch" (χ) som i skotska "loch", och det rullande "r" (ρ). Bokstaven γ (gamma) före e/i låter som ett mjukt "j". Kombinationen μπ låter som "b", ντ som "d", och γκ som "g" i början av ord.',
  },
  {
    id: 'accents',
    icon: '´',
    color: 'from-purple-500 to-fuchsia-500',
    titleEn: 'Accent Marks Matter',
    titleSv: 'Accenttecken är viktiga',
    hookEn: 'That little mark above a vowel tells you which syllable to stress - and getting it wrong can change the meaning.',
    hookSv: 'Det lilla tecknet ovanför en vokal visar vilken stavelse som betonas - och fel betoning kan ändra betydelsen.',
    bodyEn: 'Modern Greek uses one accent mark: the tonos (΄). It always goes on the stressed vowel. Compare: πότε (póte = when) vs ποτέ (poté = never), and νόμος (nómos = law) vs νομός (nomós = province). Every word with more than one syllable has an accent mark. When reading, always look for it first - it is your guide to natural-sounding Greek. The stress can fall on one of the last three syllables.',
    bodySv: 'Modern grekiska använder ett accenttecken: tonos (΄). Det sitter alltid på den betonade vokalen. Jämför: πότε (póte = när) mot ποτέ (poté = aldrig), och νόμος (nómos = lag) mot νομός (nomós = provins). Varje ord med mer än en stavelse har ett accenttecken. När du läser, leta alltid efter det först - det är din guide till naturligt klingande grekiska. Betoningen kan falla på en av de tre sista stavelserna.',
  },
  {
    id: 'iotacism',
    icon: 'ι',
    color: 'from-teal-500 to-emerald-500',
    titleEn: 'The Iotacism Challenge',
    titleSv: 'Iotacism-utmaningen',
    hookEn: 'Six different letter combinations, all making the same [i] sound. Welcome to the most famous quirk of Greek.',
    hookSv: 'Sex olika bokstavskombinationer som alla låter likadant: [i]. Välkommen till grekiskans mest kända egenhet.',
    bodyEn: 'These all sound like "ee": η (eta), ι (iota), υ (upsilon), ει (ei), οι (oi), υι (yi). This happened through centuries of sound changes called "iotacism." How do you know which to use? Mostly through memorization and word families. Some patterns help: verb endings often use -ει, plural articles use -οι, and -η is common in feminine nouns. Don\'t worry about spelling perfection at A1 - focus on recognizing and reading them. Spelling accuracy comes with exposure.',
    bodySv: 'Dessa låter alla som "i": η (eta), ι (iota), υ (ypsilon), ει (ei), οι (oi), υι (yi). Detta hände genom århundraden av ljudförändringar som kallas "iotacism." Hur vet man vilken man ska använda? Mestadels genom memorering och ordfamiljer. Vissa mönster hjälper: verbändelser använder ofta -ει, plurala artiklar använder -οι, och -η är vanligt i feminina substantiv. Oroa dig inte för perfekt stavning på A1 - fokusera på att känna igen och läsa dem. Stavningsnoggrannhet kommer med exponering.',
  },
  {
    id: 'gender',
    icon: '⚤',
    color: 'from-amber-500 to-orange-500',
    titleEn: 'Masculine, Feminine, Neuter',
    titleSv: 'Maskulinum, femininum, neutrum',
    hookEn: 'Every Greek noun has a gender, and it affects articles, adjectives, and more. But the endings give it away.',
    hookSv: 'Varje grekiskt substantiv har ett genus, och det påverkar artiklar, adjektiv och mer. Men ändelserna avslöjar det.',
    bodyEn: 'Greek has three genders. The good news: noun endings are strong hints. Masculine nouns often end in -ος, -ας, -ης (ο καφές, ο άντρας). Feminine nouns often end in -α, -η (η γυναίκα, η ζωή). Neuter nouns often end in -ο, -ι, -μα (το νερό, το παιδί, το όνομα). The article changes with gender: ο (masc), η (fem), το (neuter). Swedish speakers: you already know grammatical gender from "en" and "ett" - Greek just adds a third one!',
    bodySv: 'Grekiska har tre genus. Det positiva: substantivändelser ger starka ledtrådar. Maskulina substantiv slutar ofta på -ος, -ας, -ης (ο καφές, ο άντρας). Feminina substantiv slutar ofta på -α, -η (η γυναίκα, η ζωή). Neutrala substantiv slutar ofta på -ο, -ι, -μα (το νερό, το παιδί, το όνομα). Artikeln ändras med genus: ο (mask), η (fem), το (neutrum). Som svensktalande kan du redan grammatiskt genus från "en" och "ett" - grekiska lägger bara till ett tredje!',
  },
  {
    id: 'tprs',
    icon: '📖',
    color: 'from-rose-500 to-pink-500',
    titleEn: 'Learn Through Stories',
    titleSv: 'Lär dig genom berättelser',
    hookEn: 'TPRS (Teaching Proficiency through Reading and Storytelling) is why OTHERlingo uses stories in every lesson.',
    hookSv: 'TPRS (Teaching Proficiency through Reading and Storytelling) är anledningen till att OTHERlingo använder berättelser i varje lektion.',
    bodyEn: 'Research shows that we acquire language best through comprehensible input - messages we can understand. Stories provide natural, memorable context for new words and grammar. Instead of memorizing isolated rules, you encounter patterns in meaningful situations. Each OTHERlingo lesson tells a mini-story, gradually introducing new vocabulary while recycling what you already know. Your brain is wired for narrative - use it!',
    bodySv: 'Forskning visar att vi tillägnar oss språk bäst genom begriplig input - meddelanden vi kan förstå. Berättelser ger naturlig, minnesvärd kontext för nya ord och grammatik. Istället för att memorera isolerade regler möter du mönster i meningsfulla situationer. Varje OTHERlingo-lektion berättar en minihistoria som gradvis introducerar nytt ordförråd samtidigt som det återanvänder det du redan kan. Din hjärna är programmerad för berättelser - använd det!',
  },
  {
    id: 'consistency',
    icon: '📅',
    color: 'from-indigo-500 to-blue-500',
    titleEn: 'Daily Practice > Weekend Cramming',
    titleSv: 'Daglig övning > Helgplugg',
    hookEn: '10 minutes every day beats 2 hours on Sunday. Your brain needs repetition spread over time.',
    hookSv: '10 minuter varje dag slår 2 timmar på söndag. Din hjärna behöver repetition utspridd över tid.',
    bodyEn: 'Spaced repetition is the most powerful learning technique we know. When you study a little each day, your brain moves information from short-term to long-term memory through repeated, spaced encounters. Try to make Greek part of your daily routine: one lesson with your morning coffee, review flashcards on the bus, or listen to a Greek song before bed. Consistency builds neural pathways. Set a daily reminder and aim for a streak!',
    bodySv: 'Utspridd repetition är den mest kraftfulla inlärningsteknik vi känner till. När du studerar lite varje dag flyttar din hjärna information från korttidsminne till långtidsminne genom upprepade, utspridda möten. Försök göra grekiska till en del av din dagliga rutin: en lektion med morgonkaffet, repetera flashcards på bussen, eller lyssna på en grekisk låt före läggdags. Konsekvens bygger nervbanor. Sätt en daglig påminnelse och sikta på en streak!',
  },
  {
    id: 'speak',
    icon: '🎤',
    color: 'from-emerald-500 to-green-500',
    titleEn: 'Speak from Day 1',
    titleSv: 'Prata från dag 1',
    hookEn: 'Don\'t wait until you\'re "ready." Production strengthens memory in ways that passive study cannot.',
    hookSv: 'Vänta inte tills du är "redo." Produktion stärker minnet på sätt som passiv studering inte kan.',
    bodyEn: 'Many learners want to wait until they are "good enough" to speak. But speaking activates different brain pathways than listening or reading. Even saying words aloud while studying helps cement them in memory. Use the audio feature in OTHERlingo to listen, then repeat out loud. Talk to yourself in Greek. Order your coffee in Greek next time you are in Greece. Make mistakes - they are the fastest path to fluency. Every native speaker was once a beginner who sounded funny.',
    bodySv: 'Många som lär sig vill vänta tills de är "tillräckligt bra" för att prata. Men att prata aktiverar andra hjärnbanor än att lyssna eller läsa. Att bara säga ord högt medan du studerar hjälper till att cementera dem i minnet. Använd ljudfunktionen i OTHERlingo för att lyssna, repetera sedan högt. Prata med dig själv på grekiska. Beställ ditt kaffe på grekiska nästa gång du är i Grekland. Gör fel - de är den snabbaste vägen till flyt. Varje modersmålstalare var en gång en nybörjare som lät rolig.',
  },
  {
    id: 'swedish-advantage',
    icon: '🇸🇪',
    color: 'from-sky-500 to-blue-500',
    titleEn: 'Swedish Speakers: Your Advantages',
    titleSv: 'Svensktalande: Dina fördelar',
    hookEn: 'Swedish and Greek share more than you might think.',
    hookSv: 'Svenska och grekiska har mer gemensamt än du kanske tror.',
    bodyEn: 'As a Swedish speaker learning Greek, you have several advantages...',
    bodySv: 'Som svensktalande har du flera fördelar när du lär dig grekiska. Ni delar grammatiskt genus (en/ett liknar ο/η/το). Ordföljden är relativt lik - SVO (subjekt-verb-objekt) i båda språken. Många vetenskapliga och medicinska termer i svenska kommer från grekiska (demokrati, filosofi, terapi). Svenska "sj"-ljudet kan hjälpa dig med det grekiska χ. Och viktigast: som nordbo är du van vid att lära dig nya språk. Din erfarenhet av att navigera mellan svenska och engelska ger dig verktyg som monospråkiga saknar. Du har redan bevisat att du kan - nu lägger du bara till ett språk till!',
    svOnly: true,
  },
];

export default function TipsPage() {
  const lang = useStore(s => s.settings.baseLanguage);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleTips = tips.filter(t => !t.svOnly || lang === 'sv');

  return (
    <div className="flex-1 pb-24">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Back link */}
        <Link href="/more" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors">
          <span>←</span>
          <span>{lang === 'sv' ? 'Tillbaka' : 'Back'}</span>
        </Link>

        <h1 className="text-2xl font-bold text-stone-900">
          {lang === 'sv' ? 'Studietips' : 'Study Tips'}
        </h1>
        <p className="text-sm text-stone-500">
          {lang === 'sv'
            ? 'Praktiska råd för att lära dig grekiska effektivt'
            : 'Practical advice for learning Greek effectively'}
        </p>

        {/* Tips list */}
        <div className="space-y-3">
          {visibleTips.map(tip => (
            <Card
              key={tip.id}
              padding="none"
              onClick={() => setExpandedId(expandedId === tip.id ? null : tip.id)}
              className="overflow-hidden"
            >
              {/* Gradient header bar */}
              <div className={`bg-gradient-to-r ${tip.color} px-4 py-2 flex items-center gap-2`}>
                <span className="text-lg">{tip.icon}</span>
                <span className="text-white font-semibold text-sm flex-1">
                  {lang === 'sv' ? tip.titleSv : tip.titleEn}
                </span>
                <span className="text-white/70 text-sm">{expandedId === tip.id ? '▲' : '▼'}</span>
              </div>

              {/* Hook text - always visible */}
              <div className="px-4 py-3">
                <p className="text-sm text-stone-600">
                  {lang === 'sv' ? tip.hookSv : tip.hookEn}
                </p>
              </div>

              {/* Expanded body */}
              <AnimatePresence>
                {expandedId === tip.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="border-t border-stone-100 pt-3">
                        <p className="text-sm text-stone-700 leading-relaxed">
                          {lang === 'sv' ? tip.bodySv : tip.bodyEn}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
