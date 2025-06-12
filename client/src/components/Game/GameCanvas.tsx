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

  const phase = useGame(state => state.phase);
  const gameSpeed = useGame(state => state.gameSpeed);
  const level = useGame(state => state.level);
  const activePowerUps = useGame(state => state.activePowerUps);
  const addScore = useGame(state => state.addScore);
  const loseLife = useGame(state => state.loseLife);
  const addCombo = useGame(state => state.addCombo);
  const updateCombo = useGame(state => state.updateCombo);
  const updatePowerUps = useGame(state => state.updatePowerUps);
  const activatePowerUp = useGame(state => state.activatePowerUp);
  const { playSound } = useAudio();

  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current || !canvasRef.current || phase !== "playing") return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Safe powerups with fallback
    const safePowerUps = activePowerUps || { shield: 0, speed: 0, magnet: 0 };

    // Update game state
    const result = gameEngineRef.current.update(
      inputRef.current,
      gameSpeed,
      level,
      safePowerUps,
      safePowerUps.magnet > 0
    );

    // Handle game events
    if (result.scoreGained > 0) {
      addScore(result.scoreGained);
      if (result.collected > 0) {
        addCombo();
        if (playSound) playSound('success');
      }
    }

    if (result.hit) {
      loseLife();
      if (playSound) playSound('hit');
    }

    if (result.powerUpCollected) {
      activatePowerUp(result.powerUpCollected as 'shield' | 'speed' | 'magnet');
      if (playSound) playSound('success');
    }

    // Render
    gameEngineRef.current.render(ctx);

    if (phase === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [phase]);

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
        const code = prompt('Enter cheat code:');
        if (code === '7869') {
          cheatModeRef.current = true;
          alert('Cheat mode activated! You now have permanent magnet power!');
        } else if (code !== null) {
          alert('Invalid cheat code!');
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
  }, [phase, gameLoop]);

  return (
    <canvas
      ref={canvasRef}
      className="block mx-auto border-2 border-gray-600 rounded-lg"
      style={{ background: 'linear-gradient(45deg, #2C3E50, #34495E)' }}
    />
  );
}