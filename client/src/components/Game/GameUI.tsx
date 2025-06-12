import { useGame } from "../../lib/stores/useGame";
import { useHighScore } from "../../lib/stores/useHighScore";
import { useAudio } from "../../lib/stores/useAudio";
import { Heart, Volume2, VolumeX } from "lucide-react";

export default function GameUI() {
  const { score, level, lives } = useGame();
  const { highScore } = useHighScore();
  const { isMuted, toggleMute } = useAudio();

  return (
    <div className="game-ui">
      <div className="ui-top">
        <div className="score-display">
          <div className="score">Score: {score.toLocaleString()}</div>
          <div className="high-score">High: {highScore.toLocaleString()}</div>
        </div>
        
        <div className="level-display">
          Level {level}
        </div>
        
        <div className="controls">
          <button 
            onClick={toggleMute}
            className="mute-button"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
      
      <div className="ui-bottom">
        <div className="lives-display">
          {Array.from({ length: lives }, (_, i) => (
            <Heart key={i} className="life-heart" fill="#FF6B6B" color="#FF6B6B" />
          ))}
        </div>
        
        <div className="instructions">
          Use WASD or Arrow Keys to move
        </div>
      </div>
    </div>
  );
}
