
import { useEffect, useRef, useCallback, useState } from "react";
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
    clearAllCheats
  } = useGame();
  const { playHit, playSuccess } = useAudio();

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
    const safeCheatEffects = activeCheatEffects || {
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
      ...safePowerUps,
      magnet: (cheatModeRef.current || safeCheatEffects.autoCollect) ? 999999 : safePowerUps.magnet,
      shield: safeCheatEffects.allPowerUps ? 999999 : safePowerUps.shield,
      speed: safeCheatEffects.allPowerUps ? 999999 : safePowerUps.speed
    };

    // Debug log for cheat effects (remove in production)
    if (hasActiveCheat) {
      console.log('Active cheats:', Object.entries(safeCheatEffects).filter(([_, active]) => active).map(([name]) => name));
      console.log('Cheat power-ups:', cheatPowerUps);
    }

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
          console.log('Success sound skipped (muted)');
        }
      }
    }

    if (result.hit && !safeCheatEffects.godMode && !safeCheatEffects.infiniteLives) {
      loseLife();
      try {
        playHit();
      } catch (e) {
        console.log('Hit sound skipped (muted)');
      }
    }

    if (result.powerUpCollected) {
      activatePowerUp(result.powerUpCollected as 'shield' | 'speed' | 'magnet');
      try {
        playSuccess();
      } catch (e) {
        console.log('Success sound skipped (muted)');
      }
    }
    
    // Render with cheat effects
    gameEngineRef.current.render(ctx, safeCheatEffects);

    if (phase === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [phase, gameSpeed, level, safePowerUps.shield, safePowerUps.speed, safePowerUps.magnet, addScore, loseLife, addCombo, activatePowerUp]);

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
        
        // Check passcode (you can change these to any passcode you want)
        if (passcode === '1234' || passcode === 'CHEAT' || passcode === 'ADMIN') {
          setCheatMenuOpen(true);
        } else if (passcode === '7869') {
          // Classic cheat - auto-collect
          cheatModeRef.current = true;
          activateCheatEffect('autoCollect');
          alert('✨ Classic cheat activated! Auto-collect enabled!');
        } else if (passcode !== null) {
          alert('❌ Invalid passcode!');
        }
        
        cheatPromptRef.current = false;
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          inputRef.current.up = true;
          e.preventDefault();
          break;
        case 's':
        case 'arrowdown':
          inputRef.current.down = true;
          e.preventDefault();
          break;
        case 'a':
        case 'arrowleft':
          inputRef.current.left = true;
          e.preventDefault();
          break;
        case 'd':
        case 'arrowright':
          inputRef.current.right = true;
          e.preventDefault();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          inputRef.current.up = false;
          break;
        case 's':
        case 'arrowdown':
          inputRef.current.down = false;
          break;
        case 'a':
        case 'arrowleft':
          inputRef.current.left = false;
          break;
        case 'd':
        case 'arrowright':
          inputRef.current.right = false;
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
