import { create } from "zustand";

let audioContext: AudioContext | null = null;
let backgroundOscillator: OscillatorNode | null = null;
let backgroundGain: GainNode | null = null;
let backgroundOscillator2: OscillatorNode | null = null;
let backgroundGain2: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

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

const playComplexTone = (frequencies: number[], type: OscillatorType, duration: number, volume: number) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      oscillator.type = type;
      
      const adjustedVolume = volume / frequencies.length;
      gainNode.gain.setValueAtTime(adjustedVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    });
  } catch (e) {
    console.warn('Failed to play complex audio:', e);
  }
};

const createNoiseBuffer = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 0.1; // 100ms of noise
  noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
};

const startBackgroundLoop = (volume: number) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Create noise buffer if it doesn't exist
    if (!noiseBuffer) {
      createNoiseBuffer(ctx);
    }

    // Primary ambient drone
    backgroundOscillator = ctx.createOscillator();
    backgroundGain = ctx.createGain();
    
    backgroundOscillator.connect(backgroundGain);
    backgroundGain.connect(ctx.destination);
    
    backgroundOscillator.frequency.setValueAtTime(55, ctx.currentTime);
    backgroundOscillator.type = 'sine';
    
    backgroundGain.gain.setValueAtTime(0, ctx.currentTime);
    backgroundGain.gain.linearRampToValueAtTime(volume * 0.08, ctx.currentTime + 2);
    
    backgroundOscillator.start(ctx.currentTime);

    // Secondary harmonic layer
    backgroundOscillator2 = ctx.createOscillator();
    backgroundGain2 = ctx.createGain();
    
    backgroundOscillator2.connect(backgroundGain2);
    backgroundGain2.connect(ctx.destination);
    
    backgroundOscillator2.frequency.setValueAtTime(82.5, ctx.currentTime); // Fifth harmonic
    backgroundOscillator2.type = 'triangle';
    
    backgroundGain2.gain.setValueAtTime(0, ctx.currentTime);
    backgroundGain2.gain.linearRampToValueAtTime(volume * 0.04, ctx.currentTime + 3);
    
    backgroundOscillator2.start(ctx.currentTime);

    // Add subtle white noise for atmosphere
    if (noiseBuffer) {
      const noiseSource = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.Q.setValueAtTime(0.5, ctx.currentTime);
      
      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      noiseGain.gain.setValueAtTime(0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(volume * 0.02, ctx.currentTime + 4);
      
      noiseSource.start(ctx.currentTime);
    }
  } catch (e) {
    console.warn('Failed to start background music:', e);
  }
};

const stopBackgroundLoop = () => {
  try {
    if (backgroundOscillator && backgroundGain) {
      backgroundGain.gain.linearRampToValueAtTime(0, backgroundGain.context.currentTime + 1);
      backgroundOscillator.stop(backgroundGain.context.currentTime + 1);
      backgroundOscillator = null;
      backgroundGain = null;
    }
    
    if (backgroundOscillator2 && backgroundGain2) {
      backgroundGain2.gain.linearRampToValueAtTime(0, backgroundGain2.context.currentTime + 1);
      backgroundOscillator2.stop(backgroundGain2.context.currentTime + 1);
      backgroundOscillator2 = null;
      backgroundGain2 = null;
    }
  } catch (e) {
    console.warn('Failed to stop background music:', e);
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
  playPickup: () => void;
  playBoost: () => void;
  playMagnet: () => void;
  playShield: () => void;
  playDanger: () => void;
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
    
    if (isBackgroundMusicPlaying) {
      if (backgroundGain) {
        backgroundGain.gain.setValueAtTime(volume * 0.08, backgroundGain.context.currentTime);
      }
      if (backgroundGain2) {
        backgroundGain2.gain.setValueAtTime(volume * 0.04, backgroundGain2.context.currentTime);
      }
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
      // Harsh impact sound with multiple frequencies
      playComplexTone([200, 150, 180], 'sawtooth', 0.2, volume * 0.4);
    }
  },

  playSuccess: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Pleasant success chord
      playComplexTone([523, 659, 784], 'sine', 0.4, volume * 0.3);
    }
  },

  playPowerUp: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Rising power-up sound
      const ctx = getAudioContext();
      if (ctx) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
      }
    }
  },

  playCollect: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Quick collect blip with harmonics
      playComplexTone([440, 880], 'sine', 0.12, volume * 0.25);
    }
  },

  playGameOver: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Descending game over sequence
      const ctx = getAudioContext();
      if (ctx) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.2);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1.2);
      }
    }
  },

  playLevelUp: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Triumphant level up fanfare
      playComplexTone([523, 659, 784, 1047], 'triangle', 0.8, volume * 0.4);
    }
  },

  playHighScore: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Epic high score celebration
      const ctx = getAudioContext();
      if (ctx) {
        // Multiple oscillators for a rich sound
        [523, 659, 784, 1047, 1319].forEach((freq, index) => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
          gainNode.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + index * 0.1 + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.8);
          
          oscillator.start(ctx.currentTime + index * 0.1);
          oscillator.stop(ctx.currentTime + index * 0.1 + 0.8);
        });
      }
    }
  },

  playMove: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Very subtle movement whoosh
      playTone(80, 'sine', 0.03, volume * 0.03);
    }
  },

  playPickup: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Quick pickup sound
      playTone(660, 'square', 0.08, volume * 0.2);
    }
  },

  playBoost: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Speed boost whoosh
      const ctx = getAudioContext();
      if (ctx) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
      }
    }
  },

  playMagnet: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Magnetic pull sound
      playComplexTone([300, 450, 600], 'triangle', 0.4, volume * 0.25);
    }
  },

  playShield: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Shield activation sound
      playComplexTone([400, 800, 1200], 'sine', 0.6, volume * 0.3);
    }
  },

  playDanger: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      // Warning/danger sound
      playTone(220, 'square', 0.1, volume * 0.4);
    }
  },
}));