import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HighScoreState {
  highScore: number;
  updateHighScore: (score: number) => boolean;
  resetHighScore: () => void;
}

export const useHighScore = create<HighScoreState>()(
  persist(
    (set, get) => ({
      highScore: 0,
      
      updateHighScore: (score: number): boolean => {
        const currentHigh = get().highScore;
        if (score > currentHigh) {
          set({ highScore: score });
          return true; // New high score achieved
        }
        return false;
      },
      
      resetHighScore: () => {
        set({ highScore: 0 });
      }
    }),
    {
      name: "arcade-game-high-score"
    }
  )
);
