import React, { useState, useEffect } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useHighScore } from "../../lib/stores/useHighScore";
import { Play, Trophy, Volume2, List, QrCode, Download } from "lucide-react";
import Leaderboard from "./Leaderboard";
import QRCode from 'qrcode';

export default function StartScreen() {
  const { start, resetGame, joystickMode, toggleJoystickMode } = useGame();
  const { personalHighScore, allTimeHighScore } = useHighScore();
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    // Generate QR code for the current web app URL
    const generateQRCode = async () => {
      try {
        const currentUrl = window.location.href;
        const qrDataUrl = await QRCode.toDataURL(currentUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (qrCodeOpen) {
      generateQRCode();
    }
  }, [qrCodeOpen]);

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
        
        <div className="flex gap-3">
          <button
            onClick={toggleJoystickMode}
            className={`joystick-mode-button ${joystickMode ? 'active' : ''}`}
          >
            {joystickMode ? 'JOYSTICK: ON' : 'JOYSTICK: OFF'}
          </button>
          
          <button 
            className="mobile-app-button"
            onClick={() => setQrCodeOpen(true)}
          >
            <Download size={16} />
            MOBILE APP
          </button>
        </div>
        
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
