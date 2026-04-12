// Audio system using Web Speech API for Greek TTS
// Sound effects using simple Audio API (no howler dependency for initial build)

let soundEffectsEnabled = true;

export function setSoundEffectsEnabled(enabled: boolean) {
  soundEffectsEnabled = enabled;
}

// Cached Greek voice and voices-loaded promise
let cachedGreekVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded: Promise<void> | null = null;

function findAndCacheGreekVoice(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  const greekVoice = voices.find(v => v.lang.startsWith('el'));
  if (greekVoice) {
    cachedGreekVoice = greekVoice;
  }
}

function ensureVoicesLoaded(): Promise<void> {
  if (voicesLoaded) return voicesLoaded;
  voicesLoaded = new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      findAndCacheGreekVoice();
      resolve();
    } else {
      speechSynthesis.addEventListener('voiceschanged', () => {
        findAndCacheGreekVoice();
        resolve();
      }, { once: true });
    }
  });
  return voicesLoaded;
}

// Preload voices on module init
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  ensureVoicesLoaded();
}

// Greek text-to-speech using Web Speech API
export function speakGreek(text: string, rate = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    // Wait for voices to be loaded before speaking
    ensureVoicesLoaded().then(() => {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'el-GR';
      utterance.rate = rate;
      utterance.pitch = 1;

      // Use cached Greek voice if available (don't set voice to undefined)
      if (cachedGreekVoice) {
        utterance.voice = cachedGreekVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve(); // Don't fail on speech errors
      speechSynthesis.speak(utterance);
    });
  });
}

// Preload voices (public API for components to call early)
export function preloadVoices(): Promise<void> {
  return ensureVoicesLoaded();
}

// Sound effect types
type SoundEffect = 'correct' | 'incorrect' | 'combo' | 'levelUp' | 'achievement' | 'click' | 'complete';

// Generate simple sound effects using Web Audio API
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  if (!audioContext || !soundEffectsEnabled) return;

  // Resume context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

export function playSoundEffect(effect: SoundEffect) {
  if (!soundEffectsEnabled) return;

  switch (effect) {
    case 'correct':
      playTone(523, 0.15, 'sine', 0.2); // C5
      setTimeout(() => playTone(659, 0.2, 'sine', 0.2), 100); // E5
      break;
    case 'incorrect':
      playTone(200, 0.3, 'sawtooth', 0.15);
      break;
    case 'combo':
      playTone(659, 0.1, 'sine', 0.25); // E5
      setTimeout(() => playTone(784, 0.1, 'sine', 0.25), 80); // G5
      setTimeout(() => playTone(1047, 0.15, 'sine', 0.25), 160); // C6
      break;
    case 'levelUp':
      [523, 659, 784, 1047].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'sine', 0.2), i * 120);
      });
      break;
    case 'achievement':
      [784, 988, 1175, 1319, 1568].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.25, 'sine', 0.15), i * 100);
      });
      break;
    case 'click':
      playTone(800, 0.05, 'sine', 0.1);
      break;
    case 'complete':
      [523, 659, 784, 1047, 1319].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.3, 'triangle', 0.2), i * 150);
      });
      break;
  }
}
