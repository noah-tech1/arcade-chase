import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  score: number;
  level: number;
  lives: number;
  gameSpeed: number;
  combo: number;
  comboTimer: number;

  // Power-ups
  activePowerUps: {
    shield: number;
    speed: number;
    magnet: number;
  };

  // Game actions
  start: () => void;
  restart: () => void;
  end: () => void;

  // Score and progression
  addScore: (points: number) => void;
  loseLife: () => void;
  nextLevel: () => void;
  resetGame: () => void;

  // Combo system
  addCombo: () => void;
  resetCombo: () => void;
  updateCombo: () => void;

  // Power-up system
  activatePowerUp: (type: 'shield' | 'speed' | 'magnet') => void;
  updatePowerUps: () => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    score: 0,
    level: 1,
    lives: 3,
    gameSpeed: 1,
    combo: 0,
    comboTimer: 0,
    activePowerUps: {
      shield: 0,
      speed: 0,
      magnet: 0
    },

    start: () => {
      set((state) => {
        if (state.phase === "ready") {
          return { phase: "playing" };
        }
        return {};
      });
    },

    restart: () => {
      set(() => ({ 
        phase: "ready",
        score: 0,
        level: 1,
        lives: 3,
        gameSpeed: 1,
        combo: 0,
        comboTimer: 0,
        activePowerUps: {
          shield: 0,
          speed: 0,
          magnet: 0
        }
      }));
    },

    end: () => {
      set((state) => {
        if (state.phase === "playing") {
          return { phase: "ended" };
        }
        return {};
      });
    },

    addScore: (points: number) => {
      set((state) => {
        const comboMultiplier = Math.min(1 + state.combo * 0.1, 3);
        const adjustedPoints = Math.floor(points * comboMultiplier);
        const newScore = state.score + adjustedPoints;

        // Level up every 1500 points
        const newLevel = Math.floor(newScore / 1500) + 1;
        const levelChanged = newLevel > state.level;

        return {
          score: newScore,
          level: newLevel,
          gameSpeed: levelChanged ? Math.min(2.5, 1 + (newLevel - 1) * 0.15) : state.gameSpeed
        };
      });
    },

    loseLife: () => {
      set((state) => {
        // Check if shield is active
        if (state.activePowerUps.shield > 0) {
          return { 
            activePowerUps: { ...state.activePowerUps, shield: 0 },
            combo: 0,
            comboTimer: 0
          };
        }

        const newLives = state.lives - 1;
        if (newLives <= 0) {
          return { 
            lives: 0, 
            phase: "ended",
            combo: 0,
            comboTimer: 0
          };
        }
        return { 
          lives: newLives,
          combo: 0,
          comboTimer: 0
        };
      });
    },

    nextLevel: () => {
      set((state) => ({
        level: state.level + 1,
        gameSpeed: Math.min(2.5, 1 + state.level * 0.15)
      }));
    },

    resetGame: () => {
      set(() => ({
        score: 0,
        level: 1,
        lives: 3,
        gameSpeed: 1,
        combo: 0,
        comboTimer: 0,
        activePowerUps: {
          shield: 0,
          speed: 0,
          magnet: 0
        }
      }));
    },

    addCombo: () => {
      set((state) => ({
        combo: state.combo + 1,
        comboTimer: 180 // 3 seconds at 60fps
      }));
    },

    resetCombo: () => {
      set(() => ({
        combo: 0,
        comboTimer: 0
      }));
    },

    updateCombo: () => {
      set((state) => {
        if (state.comboTimer > 0) {
          const newTimer = state.comboTimer - 1;
          if (newTimer <= 0) {
            return { combo: 0, comboTimer: 0 };
          }
          return { comboTimer: newTimer };
        }
        return {};
      });
    },

    activatePowerUp: (type: 'shield' | 'speed' | 'magnet') => {
      set((state) => ({
        activePowerUps: {
          ...state.activePowerUps,
          [type]: 480 // 8 seconds at 60fps
        }
      }));
    },

    updatePowerUps: () => {
      set((state) => {
        const newPowerUps = { ...state.activePowerUps };
        let changed = false;

        Object.keys(newPowerUps).forEach(key => {
          const typedKey = key as keyof typeof newPowerUps;
          if (newPowerUps[typedKey] > 0) {
            newPowerUps[typedKey] = Math.max(0, newPowerUps[typedKey] - 1);
            changed = true;
          }
        });

        return changed ? { activePowerUps: newPowerUps } : {};
      });
    }
  }))
);