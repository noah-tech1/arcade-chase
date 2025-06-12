
import { useState } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useHighScore } from "../../lib/stores/useHighScore";
import { User, Trophy, Star } from "lucide-react";

export default function NameEntryScreen() {
  const [name, setName] = useState("");
  const { setPlayerName } = useGame();
  const { setPlayerName: setHighScorePlayerName, getTopScores } = useHighScore();
  const topScores = getTopScores(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playerName = name.trim() || "Anonymous";
    setPlayerName(playerName);
    setHighScorePlayerName(playerName);
  };

  return (
    <div className="name-entry-screen">
      <div className="name-entry-content">
        <h1 className="game-title">
          <span className="title-arcade">ARCADE</span>
          <span className="title-collector">COLLECTOR</span>
        </h1>
        
        <div className="name-entry-form">
          <div className="form-header">
            <User className="user-icon" />
            <h2>Enter Your Name</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="name-input"
              maxLength={20}
              autoFocus
            />
            <button type="submit" className="continue-button">
              CONTINUE
            </button>
          </form>
          
          <div className="anonymous-option">
            <button 
              onClick={() => {
                setPlayerName("Anonymous");
                setHighScorePlayerName("Anonymous");
              }}
              className="anonymous-button"
            >
              Play as Anonymous
            </button>
          </div>
        </div>

        {topScores.length > 0 && (
          <div className="leaderboard">
            <div className="leaderboard-header">
              <Trophy className="trophy-icon" />
              <h3>All-Time High Scores</h3>
            </div>
            <div className="scores-list">
              {topScores.map((entry, index) => (
                <div key={index} className="score-entry">
                  <div className="rank">
                    {index === 0 && <Star className="star-icon" />}
                    #{index + 1}
                  </div>
                  <div className="player-info">
                    <div className="player-name">{entry.playerName}</div>
                    <div className="score-details">
                      {entry.score.toLocaleString()} pts • Level {entry.level}
                    </div>
                  </div>
                  <div className="score-date">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
