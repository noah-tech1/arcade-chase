import React, { useState } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useHighScore } from "../../lib/stores/useHighScore";
import { Play, Trophy, Volume2, List } from "lucide-react";
import Leaderboard from "./Leaderboard";

export default function StartScreen() {
  const { start, resetGame, tabletMode, toggleTabletMode } = useGame();
  const { personalHighScore, allTimeHighScore } = useHighScore();
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const handleStart = () => {
    resetGame();
    start();
  };

  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="game-title">
          <span className="title-arcade">ARCADE</span>
          <span className="title-collector">COLLECTOR</span>
        </h1>
        
        <div className="game-description">
          Navigate through space, collect the glowing orbs, and avoid the dangerous obstacles!
        </div>
        
        <div className="high-score-display">
          <Trophy className="trophy-icon" />
          <div className="score-info">
            <div>Personal Best: {personalHighScore.toLocaleString()}</div>
            <div>All-Time Record: {allTimeHighScore.toLocaleString()}</div>
          </div>
        </div>
        
        <button onClick={handleStart} className="start-button">
          <Play size={20} />
          START GAME
        </button>
        
        <button 
          className="leaderboard-button"
          onClick={() => setLeaderboardOpen(true)}
        >
          <List size={16} />
          LEADERBOARD
        </button>
        
        <button
          onClick={toggleTabletMode}
          className={`tablet-mode-button ${tabletMode ? 'active' : ''}`}
        >
          {tabletMode ? 'TABLET MODE: ON' : 'TABLET MODE: OFF'}
        </button>
        
        <div className="instructions">
          <h3>How to Play:</h3>
          <ul>
            <li>Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to move</li>
            <li>Collect <span className="collectible-demo">green orbs</span> for points</li>
            <li>Avoid <span className="obstacle-demo">yellow obstacles</span></li>
            <li>Difficulty increases every 1000 points</li>
          </ul>
        </div>
        
        <div className="audio-notice">
          <Volume2 size={16} />
          <span>Sound effects available - click anywhere to enable audio</span>
        </div>
      </div>
      
      <Leaderboard 
        isOpen={leaderboardOpen} 
        onClose={() => setLeaderboardOpen(false)} 
      />
    </div>
  );
}
