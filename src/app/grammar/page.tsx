'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { getAllGrammarRules } from '@/lib/curriculum';
import { bt } from '@/lib/i18n';
import { speakGreek } from '@/lib/audio';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BottomNav } from '@/components/navigation/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

export default function GrammarPage() {
  const lang = useStore(s => s.settings.baseLanguage);
  const rules = getAllGrammarRules();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'verb', 'noun', 'article', 'pronoun', 'syntax', 'phonology'];
  const filteredRules = filter === 'all' ? rules : rules.filter(r => r.category === filter);

  return (
    <div className="flex-1 pb-24">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">
          {lang === 'sv' ? 'Grammatikreferens' : 'Grammar Reference'}
        </h1>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === cat ? 'bg-teal-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? (lang === 'sv' ? 'Alla' : 'All') : cat}
            </button>
          ))}
        </div>

        {/* Rules */}
        <div className="space-y-2">
          {filteredRules.map(rule => (
            <Card
              key={rule.id}
              padding="sm"
              onClick={() => setExpandedId(expandedId === rule.id ? null : rule.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900">{bt(rule.title, lang)}</span>
                    <Badge variant="cefr">{rule.cefrLevel}</Badge>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{bt(rule.quickReference, lang)}</div>
                </div>
                <span className="text-stone-300">{expandedId === rule.id ? '▲' : '▼'}</span>
              </div>

              <AnimatePresence>
                {expandedId === rule.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-stone-100 space-y-3">
                      <div className="text-sm text-stone-700">{bt(rule.explanation, lang)}</div>

                      {rule.swedishParallel && lang === 'sv' && (
                        <div className="bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-800">
                          🇸🇪 {rule.swedishParallel}
                        </div>
                      )}

                      {rule.tables?.map((table, ti) => (
                        <div key={ti} className="overflow-x-auto">
                          <div className="text-xs font-medium text-stone-500 mb-1">{bt(table.title, lang)}</div>
                          <table className="w-full text-xs border-collapse">
                            <thead>
                              <tr>
                                <th className="text-left p-1.5 bg-stone-100 font-medium"></th>
                                {table.headers.map((h, i) => (
                                  <th key={i} className="text-center p-1.5 bg-stone-100 font-medium">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table.rows.map((row, ri) => (
                                <tr key={ri} className="border-t border-stone-100">
                                  <td className="p-1.5 text-stone-500">{row.label}</td>
                                  {row.cells.map((cell, ci) => (
                                    <td
                                      key={ci}
                                      className="p-1.5 text-center greek-text cursor-pointer hover:text-blue-600"
                                      onClick={(e) => { e.stopPropagation(); speakGreek(cell); }}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}

                      {rule.examples.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-stone-500 mb-1">
                            {lang === 'sv' ? 'Exempel:' : 'Examples:'}
                          </div>
                          {rule.examples.map((ex, i) => (
                            <div key={i} className="text-sm mt-1">
                              <span
                                className="greek-text text-stone-900 cursor-pointer hover:text-blue-600"
                                onClick={(e) => { e.stopPropagation(); speakGreek(ex.greek); }}
                              >
                                {ex.greek}
                              </span>
                              <span className="text-stone-400 ml-2">— {bt(ex.translation, lang)}</span>
                            </div>
                          ))}
                        </div>
                      )}
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
