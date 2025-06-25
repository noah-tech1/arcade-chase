
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useAudio } from "../../lib/stores/useAudio";
import { GameEngine } from "../../lib/game/GameEngine";
import CheatMenu from "./CheatMenu";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>();
  const inputRef = useRef({ left: false, right: false, up: false, down: false });
  const cheatModeRef = useRef(false);
  const cheatPromptRef = useRef(false);
  const [cheatMenuOpen, setCheatMenuOpen] = useState(false);

  const { 
    phase, 
    gameSpeed,
    level,
    activePowerUps,
    activeCheatEffects,
    addScore, 
    loseLife, 
    addCombo,
    activatePowerUp,
    activateCheatEffect,
    toggleCheatEffect,
    clearAllCheats,
    updatePowerUps,
    updateCombo
  } = useGame();
  const { playHit, playSuccess, playCollect, playPowerUp, playLevelUp, playMove, startBackgroundMusic, stopBackgroundMusic, initializeAudio } = useAudio();

  // Initialize audio and start background music when game starts
  React.useEffect(() => {
    if (phase === 'playing') {
      initializeAudio();
      startBackgroundMusic();
    } else if (phase === 'gameOver' || phase === 'start') {
      stopBackgroundMusic();
    }
  }, [phase, initializeAudio, startBackgroundMusic, stopBackgroundMusic]);

  // Ensure activePowerUps has default values
  const safePowerUps = activePowerUps || {
    shield: 0,
    speed: 0,
    magnet: 0
  };

  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current || !canvasRef.current || phase !== "playing") return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Apply enhanced cheat effects
    // Get fresh cheat effects directly from store to ensure latest state
    const currentCheatEffects = useGame.getState().activeCheatEffects;
    const safeCheatEffects = currentCheatEffects || {
      godMode: false,
      slowMotion: false,
      doubleScore: false,
      superSpeed: false,
      rainbowMode: false,
      bigPlayer: false,
      tinyPlayer: false,
      infiniteLives: false,
      noObstacles: false,
      autoCollect: false,
      extraLives: false,
      tripleScore: false,
      maxSpeed: false,
      gigaPlayer: false,
      microPlayer: false,
      allPowerUps: false,
      scoreBoost: false,
      timeFreeze: false,
    };

    let effectiveGameSpeed = gameSpeed;
    if (safeCheatEffects.timeFreeze) effectiveGameSpeed *= 0.1;
    else if (safeCheatEffects.slowMotion) effectiveGameSpeed *= 0.3;
    else if (safeCheatEffects.maxSpeed) effectiveGameSpeed *= 3;
    else if (safeCheatEffects.superSpeed) effectiveGameSpeed *= 2;

    // Enable cheat mode if any cheat effects are active
    const hasActiveCheat = Object.values(safeCheatEffects).some(Boolean);
    if (hasActiveCheat) {
      cheatModeRef.current = true;
    }

    const cheatPowerUps = {
      magnet: (cheatModeRef.current || safeCheatEffects.autoCollect || safeCheatEffects.allPowerUps) ? 999999 : safePowerUps.magnet,
      shield: (safeCheatEffects.allPowerUps || safeCheatEffects.godMode) ? 999999 : safePowerUps.shield,
      speed: (safeCheatEffects.allPowerUps || safeCheatEffects.superSpeed || safeCheatEffects.maxSpeed) ? 999999 : safePowerUps.speed
    };

    // Remove debug logging for production

    // Debug input state (disabled)
    // const hasInput = inputRef.current.left || inputRef.current.right || inputRef.current.up || inputRef.current.down;
    // if (hasInput) {
    //   console.log('Input state:', inputRef.current);
    // }

    // Update game state with cheat effects
    const result = gameEngineRef.current.update(
      inputRef.current,
      effectiveGameSpeed,
      level,
      cheatPowerUps,
      cheatPowerUps.magnet > 0,
      safeCheatEffects
    );

    // Handle game events
    if (result.scoreGained > 0) {
      addScore(result.scoreGained);
      if (result.collected > 0) {
        addCombo();
        try {
          playSuccess();
        } catch (e) {
          // Audio disabled or unavailable
        }
      }
    }

    // Only take damage if not protected by any invincibility
    const isProtected = safeCheatEffects.godMode || safeCheatEffects.infiniteLives || cheatPowerUps.shield > 0;
    

    
    if (result.hit && !isProtected) {
      loseLife();
      try {
        playHit();
      } catch (e) {
        // Audio disabled or unavailable
      }
    }

    if (result.powerUpCollected) {
      activatePowerUp(result.powerUpCollected as 'shield' | 'speed' | 'magnet');
      try {
        playSuccess();
      } catch (e) {
        // Audio disabled or unavailable
      }
    }
    
    // Render with cheat effects
    gameEngineRef.current.render(ctx, safeCheatEffects);

    if (phase === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [phase, gameSpeed, level, safePowerUps.shield, safePowerUps.speed, safePowerUps.magnet, addScore, loseLife, addCombo, activatePowerUp, activeCheatEffects]);

  // Power-up timer system - runs independently of game loop
  useEffect(() => {
    if (phase !== "playing") return;

    const powerUpTimer = setInterval(() => {
      updatePowerUps();
      updateCombo();
    }, 1000 / 60); // 60fps

    return () => clearInterval(powerUpTimer);
  }, [phase, updatePowerUps, updateCombo]);

  // Initialize canvas and game engine once
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Initialize game engine with canvas dimensions
    gameEngineRef.current = new GameEngine(800, 600);

    // Add keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle cheat menu activation
      if (e.key === '8' && !cheatPromptRef.current && phase === 'playing') {
        cheatPromptRef.current = true;
        const passcode = prompt('🔒 Enter passcode:');
        
        // Check passcode
        if (passcode === '7456660641') {
          setCheatMenuOpen(true);
        } else if (passcode !== null) {
          alert('❌ Invalid passcode!');
        }
        
        cheatPromptRef.current = false;
        return;
      }

      // Debug logging (remove after fixing)
      // console.log('Key pressed:', e.key, 'Phase:', phase);
      
      // Use e.key for exact arrow key matching
      if (phase === 'playing') {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            inputRef.current.up = true;
            // console.log('UP movement set to true');
            e.preventDefault();
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            inputRef.current.down = true;
            // console.log('DOWN movement set to true');
            e.preventDefault();
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            inputRef.current.left = true;
            // console.log('LEFT movement set to true');
            e.preventDefault();
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            inputRef.current.right = true;
            // console.log('RIGHT movement set to true');
            e.preventDefault();
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // console.log('Key released:', e.key);
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          inputRef.current.up = false;
          // console.log('UP movement set to false');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          inputRef.current.down = false;
          // console.log('DOWN movement set to false');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          inputRef.current.left = false;
          // console.log('LEFT movement set to false');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          inputRef.current.right = false;
          // console.log('RIGHT movement set to false');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle game loop
  useEffect(() => {
    if (phase === "playing") {
      gameLoop();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, gameLoop]);

  // Handle power-up and combo updates in the game store automatically

  return (
    <>
      <canvas
        ref={canvasRef}
        className="block mx-auto border-2 border-gray-600 rounded-lg"
        style={{ background: 'linear-gradient(45deg, #2C3E50, #34495E)' }}
      />
      <CheatMenu 
        isOpen={cheatMenuOpen} 
        onClose={() => setCheatMenuOpen(false)} 
      />
    </>
  );
}
