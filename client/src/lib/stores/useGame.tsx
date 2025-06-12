import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  score: number;
  level: number;
  lives: number;
  gameSpeed: number;
  
  // Game actions
  start: () => void;
  restart: () => void;
  end: () => void;
  
  // Score and progression
  addScore: (points: number) => void;
  loseLife: () => void;
  nextLevel: () => void;
  resetGame: () => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    score: 0,
    level: 1,
    lives: 3,
    gameSpeed: 1,
    
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
        gameSpeed: 1
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
        const newScore = state.score + points;
        // Level up every 1000 points
        const newLevel = Math.floor(newScore / 1000) + 1;
        const levelChanged = newLevel > state.level;
        
        return {
          score: newScore,
          level: newLevel,
          gameSpeed: levelChanged ? Math.min(3, 1 + (newLevel - 1) * 0.2) : state.gameSpeed
        };
      });
    },
    
    loseLife: () => {
      set((state) => {
        const newLives = state.lives - 1;
        if (newLives <= 0) {
          return { lives: 0, phase: "ended" };
        }
        return { lives: newLives };
      });
    },
    
    nextLevel: () => {
      set((state) => ({
        level: state.level + 1,
        gameSpeed: Math.min(3, 1 + state.level * 0.2)
      }));
    },
    
    resetGame: () => {
      set(() => ({
        score: 0,
        level: 1,
        lives: 3,
        gameSpeed: 1
      }));
    }
  }))
);
