import React, { useState, useEffect, useRef } from 'react';

interface FPSCounterProps {
  gameStats?: {
    score: number;
    level: number;
    lives: number;
    collectiblesCollected: number;
    obstaclesAvoided: number;
    timePlayed: number;
  };
}

export const FPSCounter: React.FC<FPSCounterProps> = ({ gameStats }) => {
  const [fps, setFps] = useState(0);
  const [avgFps, setAvgFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    let animationFrameId: number;

    const calculateFPS = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      if (delta >= 1000) { // Update every second
        const currentFps = Math.round((frameCountRef.current * 1000) / delta);
        setFps(currentFps);
        
        // Track FPS history for average
        fpsHistoryRef.current.push(currentFps);
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift();
        }
        
        const avg = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
        setAvgFps(Math.round(avg));
        
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      frameCountRef.current++;
      animationFrameId = requestAnimationFrame(calculateFPS);
    };

    calculateFPS();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 50) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-2 left-2 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-3 font-mono text-xs text-white border border-white/20">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {/* Performance Stats */}
        <div className="col-span-2 text-center text-cyan-400 font-bold mb-1 border-b border-white/20 pb-1">
          PERFORMANCE
        </div>
        
        <div className="text-gray-300">FPS:</div>
        <div className={`font-bold ${getFpsColor(fps)}`}>{fps}</div>
        
        <div className="text-gray-300">Avg FPS:</div>
        <div className={`font-bold ${getFpsColor(avgFps)}`}>{avgFps}</div>
        
        {/* Game Stats */}
        {gameStats && (
          <>
            <div className="col-span-2 text-center text-purple-400 font-bold mt-2 mb-1 border-b border-white/20 pb-1">
              GAME STATS
            </div>
            
            <div className="text-gray-300">Score:</div>
            <div className="text-yellow-400 font-bold">{gameStats.score.toLocaleString()}</div>
            
            <div className="text-gray-300">Level:</div>
            <div className="text-blue-400 font-bold">{gameStats.level}</div>
            
            <div className="text-gray-300">Lives:</div>
            <div className="text-red-400 font-bold">{gameStats.lives}</div>
            
            <div className="text-gray-300">Collected:</div>
            <div className="text-green-400 font-bold">{gameStats.collectiblesCollected}</div>
            
            <div className="text-gray-300">Avoided:</div>
            <div className="text-orange-400 font-bold">{gameStats.obstaclesAvoided}</div>
            
            <div className="text-gray-300">Time:</div>
            <div className="text-cyan-400 font-bold">{formatTime(gameStats.timePlayed)}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default FPSCounter;