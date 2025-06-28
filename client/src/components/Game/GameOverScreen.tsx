import React from "react";
import { useGame } from "../../lib/stores/useGame";
import { useHighScore } from "../../lib/stores/useHighScore";
import { useAudio } from "../../lib/stores/useAudio";
import { RotateCcw, Trophy, Target } from "lucide-react";

export default function GameOverScreen() {
  const { score, level, restart, startTransition } = useGame();
  const { 
    personalHighScore, 
    allTimeHighScore, 
    playerName, 
    updatePersonalHighScore, 
    updateAllTimeHighScore,
    addToLeaderboard,
    cleanupDuplicates 
  } = useHighScore();
  const { playGameOver, playHighScore } = useAudio();

  const isNewHighScore = score > personalHighScore;
  
  // Check if this is a new high score when component mounts
  React.useEffect(() => {
    // Play appropriate sound when game over screen appears
    if (isNewHighScore) {
      playHighScore();
    } else {
      playGameOver();
    }

    const handleScoreUpdate = async () => {
      if (score > 0) {
        updatePersonalHighScore(score, level);
        updateAllTimeHighScore(score, playerName || "Player", level);
        
        // Only add to leaderboard if player has a name and score is significant
        if (playerName && score >= 50) {
          await addToLeaderboard(playerName, score, level);
        }
      }
    };
    
    handleScoreUpdate();
  }, [score, level, playerName, updatePersonalHighScore, updateAllTimeHighScore, addToLeaderboard]);
  
  const isNewPersonalHigh = score > 0 && score === personalHighScore;
  const isNewAllTimeHigh = score > 0 && score === allTimeHighScore;

  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <h1 className="game-over-title">GAME OVER</h1>
        
        {(isNewPersonalHigh || isNewAllTimeHigh) && (
          <div className="new-high-score">
            <Trophy className="trophy-icon" />
            <span>{isNewAllTimeHigh ? 'NEW ALL-TIME RECORD!' : 'NEW PERSONAL BEST!'}</span>
          </div>
        )}
        
        <div className="final-stats">
          <div className="stat">
            <Target className="stat-icon" />
            <div className="stat-info">
              <div className="stat-label">Final Score</div>
              <div className="stat-value">{score.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-icon level-icon">{level}</div>
            <div className="stat-info">
              <div className="stat-label">Level Reached</div>
              <div className="stat-value">Level {level}</div>
            </div>
          </div>
          
          <div className="stat">
            <Trophy className="stat-icon" />
            <div className="stat-info">
              <div className="stat-label">Personal Best</div>
              <div className="stat-value">{personalHighScore.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            restart();
            startTransition("ready", "slideDown");
          }} 
          className="restart-button"
        >
          <RotateCcw size={20} />
          PLAY AGAIN
        </button>
        
        <div className="encouragement">
          {(isNewPersonalHigh || isNewAllTimeHigh) ? (
            "Incredible! You've set a new record!"
          ) : score >= personalHighScore * 0.8 ? (
            "So close to your personal best! Try again!"
          ) : (
            "Keep practicing to improve your score!"
          )}
        </div>
      </div>
    </div>
  );
}
