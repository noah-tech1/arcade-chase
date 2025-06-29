import React, { useState, useEffect } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useHighScore } from "../../lib/stores/useHighScore";
import { useAuth } from "../../lib/stores/useAuth";
import { useAudio } from "../../lib/stores/useAudio";
import { Play, Trophy, Volume2, VolumeX, List, QrCode, Download, Settings, Smartphone, User, LogOut } from "lucide-react";
import Leaderboard from "./Leaderboard";
import AuthModal from "../Auth/AuthModal";
import SettingsModal from "./SettingsModal";
import QRCode from 'qrcode';

export default function StartScreen() {
  const { start, resetGame, joystickMode, toggleJoystickMode, startTransition } = useGame();
  const { personalHighScore, allTimeHighScore, playerName, hasSetName, setPlayerName } = useHighScore();
  const { user, isAuthenticated, logout, checkAuth } = useAuth();
  const { isMuted, toggleMute, volume, setVolume, initializeAudio } = useAudio();
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log('StartScreen render, qrCodeOpen:', qrCodeOpen);

  useEffect(() => {
    // Generate QR code for Chrome Extension ZIP download
    const generateQRCode = async () => {
      try {
        // Point to the Chrome Extension ZIP download endpoint
        const zipDownloadUrl = `${window.location.origin}/download/arcade-collector-chrome-extension.zip`;
        console.log('Generating QR code for Chrome Extension ZIP download:', zipDownloadUrl);
        const qrDataUrl = await QRCode.toDataURL(zipDownloadUrl, {
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
    // Initialize audio on first interaction
    try {
      initializeAudio();
    } catch (e) {
      console.warn('Audio initialization failed');
    }
    
    // If authenticated, use username
    if (isAuthenticated && user) {
      setPlayerName(user.username);
      resetGame();
      startTransition("playing", "fadeIn");
      return;
    }
    
    // If user hasn't set a name yet, prompt for it before starting
    if (!hasSetName || !playerName.trim()) {
      setShowNamePrompt(true);
    } else {
      resetGame();
      startTransition("playing", "fadeIn");
    }
  };

  const handleLogout = async () => {
    await logout();
    setPlayerName('');
  };

  const handleNameSubmit = (name: string) => {
    if (name.trim()) {
      setPlayerName(name.trim());
      setShowNamePrompt(false);
      resetGame();
      startTransition("playing", "scale");
    }
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
            {isAuthenticated && user && (
              <div className="auth-status">
                <User size={14} />
                <span>Logged in as {user.username}</span>
              </div>
            )}
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
          className="settings-button"
          onClick={() => setShowSettings(true)}
        >
          <Settings size={16} />
          SETTINGS
        </button>

        {!isAuthenticated ? (
          <button 
            className="auth-button login-button"
            onClick={() => setShowAuth(true)}
          >
            <User size={16} />
            LOGIN / REGISTER
          </button>
        ) : (
          <button 
            className="auth-button logout-button"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            LOGOUT
          </button>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={toggleJoystickMode}
            className={`joystick-mode-button ${joystickMode ? 'active' : ''}`}
          >
            {joystickMode ? 'JOYSTICK: ON' : 'JOYSTICK: OFF'}
          </button>
          
          <button 
            className="extension-button"
            onClick={() => {
              console.log('Extension download button clicked');
              setQrCodeOpen(true);
            }}
          >
            <Download size={16} />
            DOWNLOAD ZIP
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
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>Audio: {isMuted ? 'Muted' : 'Enabled'}</span>
          <button 
            onClick={() => {
              initializeAudio();
              toggleMute();
            }}
            className="ml-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
          >
            {isMuted ? 'Enable Audio' : 'Mute'}
          </button>
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
              <h2 className="text-2xl font-bold text-white">Chrome Extension Access</h2>
            </div>
            
            {/* QR Code for Chrome Extension download */}
            <div className="bg-white p-4 rounded-lg mb-6 mx-auto w-52 h-52 flex items-center justify-center">
              {qrCodeDataUrl ? (
                <div className="text-center">
                  <img src={qrCodeDataUrl} alt="QR Code" className="mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Scan to download extension</p>
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
                Scan the QR code with your phone to download the Chrome Extension ZIP file
              </p>
              
              <div className="text-sm text-gray-400 space-y-1">
                <p>✓ Offline Chrome Extension (ZIP)</p>
                <p>✓ Install directly in browser</p>
                <p>✓ No internet required after download</p>
                <p>✓ Full game features included</p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <a 
                  href={`${window.location.origin}/download/arcade-collector-chrome-extension.zip`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  download="arcade-collector-chrome-extension.zip"
                >
                  <Download size={16} />
                  Download ZIP
                </a>
              </div>
              
              <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
                <p>Direct link:</p>
                <p className="font-mono break-all text-cyan-400">{window.location.origin}/download/arcade-collector-chrome-extension.zip</p>
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

      {/* Name Prompt Modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl border border-cyan-400 max-w-md w-full mx-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Arcade Collector!</h2>
            <p className="text-gray-300 mb-6">Enter your name to save your high scores and compete on the leaderboard:</p>
            
            <input
              type="text"
              placeholder="Enter your name..."
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNameSubmit(e.currentTarget.value);
                }
              }}
            />
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  handleNameSubmit(input.value);
                }}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-200 font-bold text-lg shadow-lg"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
    </div>
  );
}
