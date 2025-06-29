import React, { useState, useEffect } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useHighScore } from "../../lib/stores/useHighScore";
import { useAuth } from "../../lib/stores/useAuth";
import { useAudio } from "../../lib/stores/useAudio";
import { 
  Play, 
  Trophy, 
  Volume2, 
  VolumeX, 
  List, 
  QrCode, 
  Download, 
  Settings, 
  Smartphone, 
  User, 
  LogOut,
  Zap,
  Crown,
  Star,
  Circle,
  Gamepad2,
  Target,
  Shield,
  Sparkles
} from "lucide-react";
import Leaderboard from "./Leaderboard";
import AuthModal from "../Auth/AuthModal";
import SettingsModal from "./SettingsModal";
import QRCode from 'qrcode';

export default function StartScreenRedesigned() {
  const { start, resetGame, joystickMode, toggleJoystickMode, startTransition } = useGame();
  const { personalHighScore, allTimeHighScore, playerName, setPlayerName } = useHighScore();
  const { user, isAuthenticated, logout, checkAuth } = useAuth();
  const { isMuted, toggleMute, volume, setVolume, initializeAudio } = useAudio();
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);

  // Animated background particles
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    color: string;
    opacity: number;
  }>>([]);

  // Initialize particles for animated background
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1,
      color: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FF6B6B', '#FFEAA7'][Math.floor(Math.random() * 5)],
      opacity: Math.random() * 0.7 + 0.3
    }));
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: (particle.y + particle.speed) % 110,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.1
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Glow effect animation
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowEffect(prev => !prev);
    }, 2000);
    return () => clearInterval(glowInterval);
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Generate QR code for Chrome Extension ZIP download
    const generateQRCode = async () => {
      try {
        const zipDownloadUrl = `${window.location.origin}/download/arcade-collector-chrome-extension.zip`;
        const qrDataUrl = await QRCode.toDataURL(zipDownloadUrl, {
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

    generateQRCode();
  }, []);

  const handleStart = async () => {
    await initializeAudio();
    
    // Check if user is authenticated
    if (isAuthenticated) {
      resetGame();
      startTransition("playing", "fadeIn");
      return;
    }
    
    // If user hasn't set a name yet, prompt for it before starting
    if (!playerName.trim() || playerName === "Player") {
      setShowNamePrompt(true);
    } else {
      resetGame();
      startTransition("playing", "fadeIn");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('playerName') as string;
    if (name?.trim()) {
      setPlayerName(name.trim());
      setShowNamePrompt(false);
      resetGame();
      startTransition("playing", "fadeIn");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}50`
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          {/* User Status */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 bg-black/20 rounded-xl px-4 py-2 backdrop-blur-sm border border-white/10">
                <User className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 shadow-lg"
              >
                <User className="w-4 h-4" />
                Login / Register
              </button>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 bg-black/20 hover:bg-black/30 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-200 group"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
            
            <button
              onClick={toggleMute}
              className="p-3 bg-black/20 hover:bg-black/30 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-200 group"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              ) : (
                <Volume2 className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Game Title */}
          <div className="text-center mb-12">
            <h1 className={`text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 transition-all duration-1000 ${glowEffect ? 'drop-shadow-2xl' : ''}`}>
              ARCADE
            </h1>
            <h2 className={`text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent transition-all duration-1000 ${glowEffect ? 'drop-shadow-2xl' : ''}`}>
              COLLECTOR
            </h2>
            <p className="text-xl text-gray-300 mt-4 font-light tracking-wide">
              The Ultimate Retro Challenge
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl w-full">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-bold text-lg">Personal Best</span>
              </div>
              <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {personalHighScore.toLocaleString()}
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-bold text-lg">World Record</span>
              </div>
              <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {allTimeHighScore.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Main Play Button */}
            <button
              onClick={handleStart}
              className="group relative w-full h-16 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 hover:from-green-400 hover:via-emerald-400 hover:to-cyan-400 rounded-2xl font-black text-white text-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-pulse" />
              <div className="relative flex items-center justify-center gap-3">
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform fill-current" />
                START GAME
                <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </div>
            </button>

            {/* Secondary Action Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={() => setLeaderboardOpen(true)}
                className="flex items-center justify-center gap-2 h-12 bg-black/30 hover:bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hover:border-purple-400/50 text-white font-medium transition-all duration-200 group"
              >
                <Trophy className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                Leaderboard
              </button>

              <button
                onClick={() => setQrCodeOpen(true)}
                className="flex items-center justify-center gap-2 h-12 bg-black/30 hover:bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hover:border-blue-400/50 text-white font-medium transition-all duration-200 group"
              >
                <Download className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center p-6">
          <p className="text-gray-400 text-sm mb-2">
            Use WASD or Arrow Keys to move • Collect items • Avoid obstacles
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3 fill-green-400 text-green-400" />
              Collect Items
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-purple-400" />
              Power-ups
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-red-400" />
              Avoid Obstacles
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Leaderboard isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      {/* QR Code Modal */}
      {qrCodeOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-md w-full border border-cyan-500/30 shadow-2xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">
                <QrCode className="w-6 h-6 text-cyan-400" />
                Download Chrome Extension
              </h3>
              
              {qrCodeDataUrl && (
                <div className="bg-white p-4 rounded-xl mb-6 inline-block">
                  <img src={qrCodeDataUrl} alt="Download QR Code" className="w-48 h-48" />
                </div>
              )}
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Scan this QR code with your phone or click the button below to download the Chrome extension version of the game.
              </p>
              
              <div className="flex gap-3">
                <a
                  href="/download/arcade-collector-chrome-extension.zip"
                  download
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-xl text-white font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download ZIP
                </a>
                <button
                  onClick={() => setQrCodeOpen(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Name Prompt Modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-md w-full border border-cyan-500/30 shadow-2xl">
            <form onSubmit={handleNameSubmit} className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">
                <User className="w-6 h-6 text-cyan-400" />
                Enter Your Name
              </h3>
              
              <input
                type="text"
                name="playerName"
                placeholder="Enter player name..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 mb-6"
                autoFocus
                maxLength={20}
              />
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-xl text-white font-bold transition-all duration-200 shadow-lg"
                >
                  Start Game
                </button>
                <button
                  type="button"
                  onClick={() => setShowNamePrompt(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}