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

  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;

    // Just update the muted state
    set({ isMuted: newMutedState });

    // Sound state toggled
  },

  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        // Audio muted
        return;
      }

      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        // Audio playback failed
      });
    }
  },

  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        // Audio muted
        return;
      }

      successSound.currentTime = 0;
      successSound.play().catch(error => {
        // Audio playback failed
      });
    }
  }
}));