import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "name-entry" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  score: number;
  level: number;
  lives: number;
  gameSpeed: number;
  combo: number;
  comboTimer: number;
  cheatMode: boolean;
  playerName: string;

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
  setPlayerName: (name: string) => void;

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

  // Cheat system
  enableCheatMode: () => void;
  disableCheatMode: () => void;
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
    cheatMode: false,
    playerName: "",
    activePowerUps: {
      shield: 0,
      speed: 0,
      magnet: 0
    },

    setPlayerName: (name: string) => {
      set({ playerName: name, phase: "ready" });
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
        phase: "nameEntry",
        score: 0,
        level: 1,
        lives: 3,
        gameSpeed: 1,
        combo: 0,
        comboTimer: 0,
        cheatMode: false,
        playerName: "",
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
          console.log(`Game ended with score: ${state.score} for player: ${state.playerName}`);
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

        console.log(`Score: ${state.score} + ${adjustedPoints} = ${newScore} (combo: ${state.combo}x)`);

        // Level up every 1500 points
        const newLevel = Math.floor(newScore / 1500) + 1;
        const levelChanged = newLevel > state.level;

        if (levelChanged) {
          console.log(`Level up! New level: ${newLevel}`);
        }

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
        if (state.activePowerUps?.shield > 0) {
          console.log("Shield absorbed hit!");
          return { 
            activePowerUps: { ...state.activePowerUps, shield: 0 },
            combo: 0,
            comboTimer: 0
          };
        }

        const newLives = state.lives - 1;
        console.log(`Life lost! Lives remaining: ${newLives}`);

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
      set((state) => ({
        score: 0,
        level: 1,
        lives: 3,
        gameSpeed: 1,
        combo: 0,
        comboTimer: 0,
        cheatMode: false,
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
    },

    enableCheatMode: () => {
      set(() => ({ cheatMode: true }));
    },

    disableCheatMode: () => {
      set(() => ({ cheatMode: false }));
    }
  }))
);