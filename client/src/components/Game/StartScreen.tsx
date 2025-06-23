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

  console.log('StartScreen render, qrCodeOpen:', qrCodeOpen);

  useEffect(() => {
    // Generate QR code for the current web app URL
    const generateQRCode = async () => {
      try {
        const currentUrl = window.location.href;
        console.log('Generating QR code for:', currentUrl);
        const qrDataUrl = await QRCode.toDataURL(currentUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        console.log('QR code generated successfully');
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (qrCodeOpen) {
      console.log('QR code modal should open, generating QR code...');
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
            onClick={() => {
              console.log('Mobile app button clicked');
              setQrCodeOpen(true);
            }}
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

      {qrCodeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl border border-cyan-400 max-w-md w-full mx-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <QrCode className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Mobile App Access</h2>
            </div>
            
            {/* QR Code for current web app */}
            <div className="bg-white p-4 rounded-lg mb-6 mx-auto w-52 h-52 flex items-center justify-center">
              {qrCodeDataUrl ? (
                <div className="text-center">
                  <img src={qrCodeDataUrl} alt="QR Code" className="mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Scan to play on mobile</p>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode size={120} className="text-gray-800 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Generating QR code...</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-300">
                Scan the QR code with your phone camera to play the game on mobile
              </p>
              
              <div className="text-sm text-gray-400 space-y-1">
                <p>✓ Full game experience on mobile</p>
                <p>✓ Touch controls and virtual joystick</p>
                <p>✓ Same features as desktop version</p>
                <p>✓ Works in any mobile browser</p>
              </div>
              
              <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
                <p>Or manually navigate to:</p>
                <p className="font-mono break-all text-cyan-400">{window.location.href}</p>
              </div>
            </div>
            
            <button
              onClick={() => setQrCodeOpen(false)}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
