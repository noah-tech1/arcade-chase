import { useGame } from "../../lib/stores/useGame";
import { useHighScore } from "../../lib/stores/useHighScore";
import { Play, Trophy, Volume2, User, Star } from "lucide-react";

export default function StartScreen() {
  const { start, resetGame, playerName } = useGame();
  const { highScore, getTopScores } = useHighScore();
  const topScores = getTopScores(3);

  const handleStart = () => {
    resetGame();
    if (!playerName) {
      start(); // This will trigger name entry
    } else {
      start();
    }
  };

  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="game-title">
          <span className="title-arcade">ARCADE</span>
          <span className="title-collector">COLLECTOR</span>
        </h1>
        
        <div className="player-welcome">
          <User className="user-icon" />
          <span>Welcome, {playerName}!</span>
        </div>
        
        <div className="game-description">
          Navigate through space, collect the glowing orbs, and avoid the dangerous obstacles!
        </div>
        
        <div className="high-score-display">
          <Trophy className="trophy-icon" />
          <span>High Score: {highScore.toLocaleString()}</span>
        </div>
        
        <button onClick={handleStart} className="start-button">
          <Play size={20} />
          START GAME
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
        
        {topScores.length > 0 && (
          <div className="mini-leaderboard">
            <h4>Top Scores</h4>
            {topScores.map((entry, index) => (
              <div key={index} className="mini-score-entry">
                {index === 0 && <Star size={14} className="star-icon" />}
                <span className="rank">#{index + 1}</span>
                <span className="name">{entry.playerName}</span>
                <span className="score">{entry.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="audio-notice">
          <Volume2 size={16} />
          <span>Sound effects available - click anywhere to enable audio</span>
        </div>
      </div>
    </div>
  );
}
