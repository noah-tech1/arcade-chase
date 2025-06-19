
import { useEffect, useRef, useCallback } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useAudio } from "../../lib/stores/useAudio";
import { GameEngine } from "../../lib/game/GameEngine";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>();
  const inputRef = useRef({ left: false, right: false, up: false, down: false });
  const cheatModeRef = useRef(false);
  const cheatPromptRef = useRef(false);

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
    };

    const effectiveGameSpeed = safeCheatEffects.slowMotion ? gameSpeed * 0.3 : 
                              safeCheatEffects.superSpeed ? gameSpeed * 2 : gameSpeed;

    const cheatPowerUps = {
      ...safePowerUps,
      magnet: (cheatModeRef.current || safeCheatEffects.autoCollect) ? 999999 : safePowerUps.magnet
    };

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

    if (result.hit) {
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
    
    // Render
    gameEngineRef.current.render(ctx);

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
      // Handle cheat code activation
      if (e.key === '8' && !cheatPromptRef.current && phase === 'playing') {
        cheatPromptRef.current = true;
        const code = prompt('🎮 Enter cheat code:');
        
        const cheatCodes = {
          'GODMODE': () => {
            toggleCheatEffect('godMode');
            return activeCheatEffects.godMode ? 'God Mode ON - You are invincible!' : 'God Mode OFF';
          },
          'SLOWMO': () => {
            toggleCheatEffect('slowMotion');
            return activeCheatEffects.slowMotion ? 'Slow Motion ON - Time slows down!' : 'Slow Motion OFF';
          },
          'DOUBLESCORE': () => {
            toggleCheatEffect('doubleScore');
            return activeCheatEffects.doubleScore ? 'Double Score ON - 2x points!' : 'Double Score OFF';
          },
          'SPEED': () => {
            toggleCheatEffect('superSpeed');
            return activeCheatEffects.superSpeed ? 'Super Speed ON - Lightning fast!' : 'Super Speed OFF';
          },
          'RAINBOW': () => {
            toggleCheatEffect('rainbowMode');
            return activeCheatEffects.rainbowMode ? 'Rainbow Mode ON - Psychedelic colors!' : 'Rainbow Mode OFF';
          },
          'BIGPLAYER': () => {
            toggleCheatEffect('bigPlayer');
            if (activeCheatEffects.tinyPlayer) toggleCheatEffect('tinyPlayer'); // Turn off tiny if big is on
            return activeCheatEffects.bigPlayer ? 'Big Player ON - You are huge!' : 'Big Player OFF';
          },
          'TINYPLAYER': () => {
            toggleCheatEffect('tinyPlayer');
            if (activeCheatEffects.bigPlayer) toggleCheatEffect('bigPlayer'); // Turn off big if tiny is on
            return activeCheatEffects.tinyPlayer ? 'Tiny Player ON - You are tiny!' : 'Tiny Player OFF';
          },
          'INFINITELIVES': () => {
            toggleCheatEffect('infiniteLives');
            return activeCheatEffects.infiniteLives ? 'Infinite Lives ON - Never die!' : 'Infinite Lives OFF';
          },
          'NOOBSTACLES': () => {
            toggleCheatEffect('noObstacles');
            return activeCheatEffects.noObstacles ? 'No Obstacles ON - Clear path!' : 'No Obstacles OFF';
          },
          'AUTOCOLLECT': () => {
            toggleCheatEffect('autoCollect');
            return activeCheatEffects.autoCollect ? 'Auto Collect ON - Items come to you!' : 'Auto Collect OFF';
          },
          'CLEARALL': () => {
            clearAllCheats();
            return 'All cheats cleared!';
          },
          '7869': () => {
            cheatModeRef.current = true;
            activateCheatEffect('autoCollect');
            return 'Classic cheat activated! Auto-collect enabled!';
          }
        };

        const upperCode = code?.toUpperCase();
        if (upperCode && upperCode in cheatCodes) {
          const message = (cheatCodes as any)[upperCode]();
          alert(`✨ ${message}`);
        } else if (code === 'HELP' || code === '?') {
          alert(`🎮 Available Cheat Codes:
GODMODE - Invincibility
SLOWMO - Slow motion effect
DOUBLESCORE - Double points
SPEED - Super speed
RAINBOW - Rainbow colors
BIGPLAYER - Giant player
TINYPLAYER - Tiny player
INFINITELIVES - Never lose lives
NOOBSTACLES - Remove obstacles
AUTOCOLLECT - Items come to you
CLEARALL - Clear all cheats
7869 - Classic cheat`);
        } else if (code !== null) {
          alert('❌ Invalid cheat code! Type "HELP" for available codes.');
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
    <canvas
      ref={canvasRef}
      className="block mx-auto border-2 border-gray-600 rounded-lg"
      style={{ background: 'linear-gradient(45deg, #2C3E50, #34495E)' }}
    />
  );
}
