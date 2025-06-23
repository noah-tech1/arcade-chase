import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
  level: number;
}

interface HighScoreState {
  personalHighScore: number;
  allTimeHighScore: number;
  leaderboard: LeaderboardEntry[];
  playerName: string;
  updatePersonalHighScore: (score: number, level: number) => boolean;
  updateAllTimeHighScore: (score: number, playerName: string, level: number) => boolean;
  addToLeaderboard: (name: string, score: number, level: number) => void;
  resetPersonalHighScore: () => void;
  setPlayerName: (name: string) => void;
  getTopScores: (limit?: number) => LeaderboardEntry[];
  clearPlayerFromLeaderboard: (playerName: string) => void;
  cleanupDuplicates: () => void;
}

export const useHighScore = create<HighScoreState>()(
  persist(
    (set, get) => ({
      personalHighScore: 0,
      allTimeHighScore: 0,
      leaderboard: [],
      playerName: "Player",
      
      updatePersonalHighScore: (score: number, level: number) => {
        const currentPersonalHigh = get().personalHighScore;
        if (score > currentPersonalHigh) {
          set({ personalHighScore: score });
          
          // Also check if it's a new all-time high
          const state = get();
          if (score > state.allTimeHighScore) {
            state.updateAllTimeHighScore(score, state.playerName, level);
          }
          
          // Add to leaderboard
          state.addToLeaderboard(state.playerName, score, level);
          
          return true; // New personal high score
        }
        return false;
      },
      
      updateAllTimeHighScore: (score: number, playerName: string, level: number) => {
        const currentAllTimeHigh = get().allTimeHighScore;
        if (score > currentAllTimeHigh) {
          set({ allTimeHighScore: score });
          return true; // New all-time high score
        }
        return false;
      },
      
      addToLeaderboard: (name: string, score: number, level: number) => {
        set((state) => {
          // Find existing player entry (case-insensitive)
          const existingIndex = state.leaderboard.findIndex(entry => 
            entry.name.toLowerCase() === name.toLowerCase()
          );
          
          if (existingIndex !== -1) {
            // Only update if new score is higher
            if (score > state.leaderboard[existingIndex].score) {
              state.leaderboard[existingIndex] = {
                name,
                score,
                level,
                date: new Date().toLocaleDateString()
              };
            }
            // Don't add duplicate entry if score is not higher
          } else {
            // Add new player entry
            const newEntry: LeaderboardEntry = {
              name: name || "Player",
              score,
              level,
              date: new Date().toLocaleDateString()
            };
            state.leaderboard.push(newEntry);
          }
          
          // Sort by score (highest first) and keep top 10
          state.leaderboard.sort((a, b) => b.score - a.score);
          state.leaderboard = state.leaderboard.slice(0, 10);
          
          return state;
        });
      },
      
      resetPersonalHighScore: () => {
        set({ personalHighScore: 0 });
      },
      
      clearPlayerFromLeaderboard: (playerName: string) => {
        set((state) => ({
          ...state,
          leaderboard: state.leaderboard.filter(entry => 
            entry.name.toLowerCase() !== playerName.toLowerCase()
          )
        }));
      },
      
      setPlayerName: (name: string) => {
        set({ playerName: name.trim() || "Player" });
      },
      
      getTopScores: (limit = 5) => {
        return get().leaderboard.slice(0, limit);
      }
    }),
    {
      name: "arcade-collector-scores",
    }
  )
);
