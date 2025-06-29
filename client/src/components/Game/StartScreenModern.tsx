import React, { useState, useEffect } from 'react';
import { useGame } from '../../lib/stores/useGame';
import { useAudio } from '../../lib/stores/useAudio';
import { useHighScore } from '../../lib/stores/useHighScore';
import { FaPause, FaPlay, FaCog, FaTrophy, FaDownload, FaVolumeUp, FaVolumeOff } from 'react-icons/fa';

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}

interface AnimatedCounter {
  value: number;
  displayValue: number;
  increment: number;
}

export default function StartScreenModern() {
  const { start } = useGame();
  const { isMuted, toggleMute, initializeAudio } = useAudio();
  const { personalHighScore, allTimeHighScore, playerName } = useHighScore();
  
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<{
    personalScore: AnimatedCounter;
    allTimeScore: AnimatedCounter;
  }>({
    personalScore: { value: personalHighScore, displayValue: 0, increment: Math.max(1, Math.floor(personalHighScore / 100)) },
    allTimeScore: { value: allTimeHighScore, displayValue: 0, increment: Math.max(1, Math.floor(allTimeHighScore / 100)) }
  });

  // Initialize floating particles
  useEffect(() => {
    const newParticles: FloatingParticle[] = [];
    for (let i = 0; i < 25; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: `hsl(${Math.random() * 360}, 80%, 70%)`,
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        let newVx = particle.vx;
        let newVy = particle.vy;

        // Bounce off edges
        if (newX <= 0 || newX >= window.innerWidth) {
          newVx = -newVx;
          newX = Math.max(0, Math.min(window.innerWidth, newX));
        }
        if (newY <= 0 || newY >= window.innerHeight) {
          newVy = -newVy;
          newY = Math.max(0, Math.min(window.innerHeight, newY));
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      }));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Animate counters
  useEffect(() => {
    const animateCounters = () => {
      setAnimatedStats(prev => {
        const newPersonal = prev.personalScore.displayValue < prev.personalScore.value
          ? { ...prev.personalScore, displayValue: Math.min(prev.personalScore.value, prev.personalScore.displayValue + prev.personalScore.increment) }
          : prev.personalScore;
        
        const newAllTime = prev.allTimeScore.displayValue < prev.allTimeScore.value
          ? { ...prev.allTimeScore, displayValue: Math.min(prev.allTimeScore.value, prev.allTimeScore.displayValue + prev.allTimeScore.increment) }
          : prev.allTimeScore;

        return {
          personalScore: newPersonal,
          allTimeScore: newAllTime
        };
      });
    };

    const interval = setInterval(animateCounters, 50);
    return () => clearInterval(interval);
  }, []);

  const handleStartGame = () => {
    start();
  };

  const quickStats = [
    { label: 'Personal Best', value: animatedStats.personalScore.displayValue, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'All-Time Record', value: animatedStats.allTimeScore.displayValue, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Player', value: playerName || 'Anonymous', color: 'text-purple-400', bg: 'bg-purple-400/10', isText: true }
  ];

  return (
    <div className="relative min-h-screen lg:h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full blur-sm animate-pulse"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen lg:h-full">
        {/* Header */}
        <header className="flex justify-between items-center p-6 lg:p-8">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <button
              onClick={() => {
                initializeAudio();
                toggleMute();
              }}
              className="p-3 lg:p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 text-white transform hover:scale-110"
            >
              {!isMuted ? <FaVolumeUp size={20} className="lg:w-6 lg:h-6" /> : <FaVolumeOff size={20} className="lg:w-6 lg:h-6" />}
            </button>
          </div>
          
          <div className="flex items-center space-x-4 lg:space-x-6">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 lg:p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 text-white transform hover:scale-110"
            >
              <FaCog size={20} className="lg:w-6 lg:h-6" />
            </button>
          </div>
        </header>

        {/* Main Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Game Title */}
          <div className="mb-6 lg:mb-12">
            <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 lg:mb-4 tracking-wider drop-shadow-2xl">
              ARCADE
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white/90 tracking-widest mb-4 lg:mb-6">
              COLLECTOR
            </h2>
            <div className="w-32 lg:w-48 h-1 lg:h-2 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full" />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 mb-6 lg:mb-12 w-full max-w-6xl">
            {quickStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`relative p-6 lg:p-8 rounded-2xl ${stat.bg} backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-center">
                  <p className="text-white/70 text-sm lg:text-base font-medium mb-2 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-3xl lg:text-4xl xl:text-5xl font-bold ${stat.color}`}>
                    {stat.isText ? stat.value : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-8 mb-4 lg:mb-8">
            <button
              onClick={handleStartGame}
              className="group relative px-12 lg:px-16 py-4 lg:py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white font-bold text-lg lg:text-xl xl:text-2xl hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25"
            >
              <div className="flex items-center justify-center space-x-3 lg:space-x-4">
                <FaPlay className="text-sm lg:text-base group-hover:animate-pulse" />
                <span>START GAME</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
            </button>
            
            <button className="group relative px-12 lg:px-16 py-4 lg:py-5 bg-white/10 backdrop-blur-sm rounded-full text-white font-bold text-lg lg:text-xl xl:text-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20">
              <div className="flex items-center justify-center space-x-3 lg:space-x-4">
                <FaTrophy className="text-sm lg:text-base group-hover:animate-bounce" />
                <span>LEADERBOARD</span>
              </div>
            </button>
          </div>

          {/* Game Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6 w-full max-w-5xl text-center">
            {[
              { icon: '⚡', label: 'Fast-Paced' },
              { icon: '🎯', label: 'Precision' },
              { icon: '🏆', label: 'Competitive' },
              { icon: '🎮', label: 'Retro Style' }
            ].map((feature, index) => (
              <div
                key={feature.label}
                className="p-4 lg:p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl lg:text-3xl mb-2">{feature.icon}</div>
                <p className="text-white/80 text-sm lg:text-base font-medium">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 lg:p-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-white/60 text-sm lg:text-base">
              © 2025 Arcade Collector - Enhanced Edition
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300">
                <FaDownload size={14} />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Audio</span>
                <button
                  onClick={() => {
                    initializeAudio();
                    toggleMute();
                  }}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    !isMuted ? 'bg-cyan-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      !isMuted ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-white font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}