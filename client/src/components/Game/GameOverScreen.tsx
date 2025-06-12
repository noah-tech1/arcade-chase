import { useEffect } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useHighScore } from "../../lib/stores/useHighScore";
import { RotateCcw, Trophy, Target } from "lucide-react";

export default function GameOverScreen() {
  const { score, level, playerName, restart } = useGame();
  const { highScore, updateHighScore } = useHighScore();
  
  useEffect(() => {
    if (score > 0) {
      updateHighScore(score, level, playerName);
    }
  }, [score, level, playerName, updateHighScore]);
  
  const isNewHighScore = score === highScore && score > 0;

  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <h1 className="game-over-title">GAME OVER</h1>
        
        {isNewHighScore && (
          <div className="new-high-score">
            <Trophy className="trophy-icon" />
            <span>NEW HIGH SCORE!</span>
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
              <div className="stat-label">High Score</div>
              <div className="stat-value">{highScore.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <button onClick={restart} className="restart-button">
          <RotateCcw size={20} />
          PLAY AGAIN
        </button>
        
        <div className="encouragement">
          {isNewHighScore ? (
            "Incredible! You've set a new record!"
          ) : score >= highScore * 0.8 ? (
            "So close to the high score! Try again!"
          ) : (
            "Keep practicing to improve your score!"
          )}
        </div>
      </div>
    </div>
  );
}
