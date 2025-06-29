import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  show: boolean;
}

export default function SplashScreen({ onComplete, show }: SplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    "Loading Game Engine...",
    "Initializing Audio...", 
    "Setting Up Controls...",
    "Ready to Play!"
  ];

  useEffect(() => {
    if (!show) return;

    let stepIndex = 0;
    const stepDuration = 800;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (steps.length * 10));
        return Math.min(newProgress, 100);
      });
    }, stepDuration / 10);

    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
      } else {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
        setTimeout(() => {
          onComplete();
        }, stepDuration);
      }
    }, stepDuration);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center"
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 px-8">
        {/* Game Logo */}
        <div className="mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-2 border-2 border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
              🎮
            </div>
          </div>

          <h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            ARCADE COLLECTOR
          </h1>
          
          <p className="text-lg text-gray-300">Retro Gaming Experience</p>
        </div>

        {/* Loading Progress */}
        <div className="space-y-4 w-64 mx-auto">
          {/* Progress Bar */}
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current Step */}
          <div className="text-center">
            <p className="text-cyan-300 text-lg font-medium">
              {steps[currentStep]}
            </p>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress Percentage */}
          <p className="text-gray-400 text-sm animate-pulse">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Version Info */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
          <p>PWA v1.0.0 • Optimized for Mobile</p>
        </div>
      </div>
    </div>
  );
}