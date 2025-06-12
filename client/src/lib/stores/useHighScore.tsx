
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HighScoreEntry {
  playerName: string;
  score: number;
  level: number;
  date: string;
}

interface HighScoreState {
  highScore: number;
  allTimeHighScores: HighScoreEntry[];
  currentPlayerName: string;
  updateHighScore: (score: number, level: number, playerName?: string) => boolean;
  resetHighScore: () => void;
  setPlayerName: (name: string) => void;
  getTopScores: (limit?: number) => HighScoreEntry[];
}

export const useHighScore = create<HighScoreState>()(
  persist(
    (set, get) => ({
      highScore: 0,
      allTimeHighScores: [],
      currentPlayerName: "",
      
      updateHighScore: (score: number, level: number, playerName?: string): boolean => {
        const currentHigh = get().highScore;
        const player = playerName || get().currentPlayerName || "Anonymous";
        
        console.log(`Checking high score: ${score} vs current high: ${currentHigh}`);
        
        // Add to all-time high scores
        const newEntry: HighScoreEntry = {
          playerName: player,
          score,
          level,
          date: new Date().toISOString()
        };
        
        set((state) => {
          const updatedScores = [...state.allTimeHighScores, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Keep top 10 scores
          
          const newHighScore = Math.max(currentHigh, score);
          
          return {
            allTimeHighScores: updatedScores,
            highScore: newHighScore
          };
        });
        
        if (score > currentHigh) {
          console.log(`New high score achieved: ${score} by ${player}`);
          return true;
        }
        return false;
      },
      
      resetHighScore: () => {
        set({ highScore: 0, allTimeHighScores: [] });
      },
      
      setPlayerName: (name: string) => {
        set({ currentPlayerName: name });
      },
      
      getTopScores: (limit = 10) => {
        return get().allTimeHighScores.slice(0, limit);
      }
    }),
    {
      name: "arcade-game-high-scores"
    }
  )
);
