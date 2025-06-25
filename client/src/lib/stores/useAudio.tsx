import { create } from "zustand";

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
  initializeAudio: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: true, // Start muted by default

  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),

  setVolume: (volume) => {
    set({ volume });
  },

  toggleMute: () => {
    const { isMuted } = get();
    set({ isMuted: !isMuted });
  },

  initializeAudio: () => {
    // Simple initialization - just enable audio
    set({ isMuted: false });
  },

  playHit: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(volume * 0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
      } catch (e) {
        console.warn('Audio not supported');
      }
    }
  },

  playSuccess: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume * 0.6, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        console.warn('Audio not supported');
      }
    }
  },

  playPowerUp: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(volume * 0.7, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (e) {
        console.warn('Audio not supported');
      }
    }
  },

  playCollect: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume * 0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        console.warn('Audio not supported');
      }
    }
  },

  playGameOver: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(147, audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(volume * 0.8, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.0);
      } catch (e) {
        console.warn('Audio not supported');
      }
    }
  },

  playLevelUp: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(volume * 0.7, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.8);
      } catch (e) {
        console.warn('Audio not supported');
      }
    }
  },

  playHighScore: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume * 0.8, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.2);
      } catch (e) {
        console.warn('Audio not supported');
      }
    }
  }
}));