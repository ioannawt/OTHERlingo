'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function SettingsPage() {
  const lang = useStore(s => s.settings.baseLanguage);
  const settings = useStore(s => s.settings);
  const setBaseLanguage = useStore(s => s.setBaseLanguage);
  const updateSetting = useStore(s => s.updateSetting);
  const resetProgress = useStore(s => s.resetProgress);
  const [showResetModal, setShowResetModal] = useState(false);

  const toggleSettings = [
    {
      key: 'showRomanization' as const,
      label: lang === 'sv' ? 'Visa romanisering' : 'Show romanization',
      description: lang === 'sv' ? 'Visa latinska bokstäver bredvid grekiska' : 'Show Latin letters alongside Greek',
    },
    {
      key: 'enableSoundEffects' as const,
      label: lang === 'sv' ? 'Ljudeffekter' : 'Sound effects',
      description: lang === 'sv' ? 'Spela ljud vid rätt/fel svar' : 'Play sounds on correct/incorrect answers',
    },
    {
      key: 'enableAnimations' as const,
      label: lang === 'sv' ? 'Animationer' : 'Animations',
      description: lang === 'sv' ? 'Visa animationer och övergångar' : 'Show animations and transitions',
    },
  ];

  return (
    <div className="flex-1 pb-24">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-stone-900">
          {lang === 'sv' ? 'Inställningar' : 'Settings'}
        </h1>

        {/* Language */}
        <Card>
          <div className="text-sm font-semibold text-stone-700 mb-3">
            {lang === 'sv' ? 'Språk' : 'Language'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setBaseLanguage('en')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                lang === 'en' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setBaseLanguage('sv')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                lang === 'sv' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              🇸🇪 Svenska
            </button>
          </div>
        </Card>

        {/* Toggles */}
        <Card>
          <div className="space-y-4">
            {toggleSettings.map(setting => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-stone-700">{setting.label}</div>
                  <div className="text-xs text-stone-400">{setting.description}</div>
                </div>
                <button
                  onClick={() => updateSetting(setting.key, !settings[setting.key])}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    settings[setting.key] ? 'bg-blue-600' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Reset */}
        <Card>
          <Button
            variant="danger"
            fullWidth
            onClick={() => setShowResetModal(true)}
          >
            {lang === 'sv' ? 'Återställ all framsteg' : 'Reset all progress'}
          </Button>
        </Card>

        {/* About */}
        <Card padding="sm" className="text-center">
          <div className="text-2xl mb-2">🇬🇷</div>
          <div className="text-sm font-bold text-stone-900">OTHERlingo</div>
          <div className="text-xs text-stone-500 mt-1">
            {lang === 'sv' ? 'Lär dig grekiska på ett ANNAT sätt' : 'Learn Greek the OTHER way'}
          </div>
          <div className="text-xs text-stone-400 mt-2">
            Stories, not sentences. Production, not recognition.
          </div>
        </Card>
      </div>

      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title={lang === 'sv' ? 'Återställ framsteg?' : 'Reset progress?'}>
        <p className="text-sm text-stone-600 mb-4">
          {lang === 'sv'
            ? 'Detta raderar all din framsteg, inklusive ord, streak och XP. Denna åtgärd kan inte ångras.'
            : 'This will delete all your progress, including words, streak, and XP. This action cannot be undone.'
          }
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setShowResetModal(false)}>
            {lang === 'sv' ? 'Avbryt' : 'Cancel'}
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              resetProgress();
              setShowResetModal(false);
            }}
          >
            {lang === 'sv' ? 'Återställ' : 'Reset'}
          </Button>
        </div>
      </Modal>

      <BottomNav />
    </div>
  );
}
