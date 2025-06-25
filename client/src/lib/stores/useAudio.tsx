import { create } from "zustand";

let audioContext: AudioContext | null = null;
let backgroundOscillator: OscillatorNode | null = null;
let backgroundGain: GainNode | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      return null;
    }
  }
  return audioContext;
};

const playTone = (frequency: number, type: OscillatorType, duration: number, volume: number) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Failed to play audio:', e);
  }
};

const startBackgroundLoop = (volume: number) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    backgroundOscillator = ctx.createOscillator();
    backgroundGain = ctx.createGain();
    
    backgroundOscillator.connect(backgroundGain);
    backgroundGain.connect(ctx.destination);
    
    backgroundOscillator.frequency.setValueAtTime(55, ctx.currentTime);
    backgroundOscillator.type = 'sine';
    
    backgroundGain.gain.setValueAtTime(0, ctx.currentTime);
    backgroundGain.gain.linearRampToValueAtTime(volume * 0.1, ctx.currentTime + 2);
    
    backgroundOscillator.start(ctx.currentTime);
  } catch (e) {
    console.warn('Failed to start background music:', e);
  }
};

const stopBackgroundLoop = () => {
  if (backgroundOscillator && backgroundGain) {
    try {
      backgroundGain.gain.linearRampToValueAtTime(0, backgroundGain.context.currentTime + 1);
      backgroundOscillator.stop(backgroundGain.context.currentTime + 1);
      backgroundOscillator = null;
      backgroundGain = null;
    } catch (e) {
      console.warn('Failed to stop background music:', e);
    }
  }
};

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  powerUpSound: HTMLAudioElement | null;
  collectSound: HTMLAudioElement | null;
  gameOverSound: HTMLAudioElement | null;
  levelUpSound: HTMLAudioElement | null;
  highScoreSound: HTMLAudioElement | null;
  isMuted: boolean;
  volume: number;
  isBackgroundMusicPlaying: boolean;

  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setPowerUpSound: (sound: HTMLAudioElement) => void;
  setCollectSound: (sound: HTMLAudioElement) => void;
  setGameOverSound: (sound: HTMLAudioElement) => void;
  setLevelUpSound: (sound: HTMLAudioElement) => void;
  setHighScoreSound: (sound: HTMLAudioElement) => void;

  // Control functions
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playHit: () => void;
  playSuccess: () => void;
  playPowerUp: () => void;
  playCollect: () => void;
  playGameOver: () => void;
  playLevelUp: () => void;
  playHighScore: () => void;
  playMove: () => void;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  initializeAudio: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  powerUpSound: null,
  collectSound: null,
  gameOverSound: null,
  levelUpSound: null,
  highScoreSound: null,
  isMuted: false,
  volume: 0.7,
  isBackgroundMusicPlaying: false,

  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setPowerUpSound: (sound) => set({ powerUpSound: sound }),
  setCollectSound: (sound) => set({ collectSound: sound }),
  setGameOverSound: (sound) => set({ gameOverSound: sound }),
  setLevelUpSound: (sound) => set({ levelUpSound: sound }),
  setHighScoreSound: (sound) => set({ highScoreSound: sound }),

  setVolume: (volume) => {
    const { isBackgroundMusicPlaying } = get();
    set({ volume });
    
    if (isBackgroundMusicPlaying && backgroundGain) {
      backgroundGain.gain.setValueAtTime(volume * 0.1, backgroundGain.context.currentTime);
    }
  },

  toggleMute: () => {
    const { isMuted, isBackgroundMusicPlaying } = get();
    const newMuted = !isMuted;
    set({ isMuted: newMuted });
    
    if (newMuted && isBackgroundMusicPlaying) {
      stopBackgroundLoop();
      set({ isBackgroundMusicPlaying: false });
    }
  },

  initializeAudio: () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    set({ isMuted: false });
  },

  startBackgroundMusic: () => {
    const { isMuted, volume, isBackgroundMusicPlaying } = get();
    if (!isMuted && !isBackgroundMusicPlaying) {
      startBackgroundLoop(volume);
      set({ isBackgroundMusicPlaying: true });
    }
  },

  stopBackgroundMusic: () => {
    const { isBackgroundMusicPlaying } = get();
    if (isBackgroundMusicPlaying) {
      stopBackgroundLoop();
      set({ isBackgroundMusicPlaying: false });
    }
  },

  playHit: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      playTone(200, 'sawtooth', 0.15, volume * 0.3);
    }
  },

  playSuccess: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      playTone(523, 'sine', 0.3, volume * 0.4);
    }
  },

  playPowerUp: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      playTone(659, 'triangle', 0.5, volume * 0.5);
    }
  },

  playCollect: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      playTone(440, 'sine', 0.1, volume * 0.2);
    }
  },

  playGameOver: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      playTone(147, 'sawtooth', 1.0, volume * 0.6);
    }
  },

  playLevelUp: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      playTone(784, 'triangle', 0.8, volume * 0.5);
    }
  },

  playHighScore: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      playTone(880, 'sine', 1.2, volume * 0.6);
    }
  },

  playMove: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      playTone(100, 'sine', 0.05, volume * 0.05);
    }
  },
}));