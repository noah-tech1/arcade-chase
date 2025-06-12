import { useEffect, useRef, useCallback } from "react";
import { GameEngine } from "../../lib/game/GameEngine";
import { useGame } from "../../lib/stores/useGame";
import { useAudio } from "../../lib/stores/useAudio";
import { useHighScore } from "../../lib/stores/useHighScore";
import { getCanvasSize } from "../../lib/utils/gameUtils";

interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>(0);
  const inputRef = useRef<InputState>({ left: false, right: false, up: false, down: false });
  
  const { 
    phase, score, level, gameSpeed, activePowerUps, combo,
    addScore, loseLife, end, addCombo, resetCombo, updateComboTimer, 
    activatePowerUp, updatePowerUps 
  } = useGame();
  const { playHit, playSuccess } = useAudio();
  const { updateHighScore } = useHighScore();

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        inputRef.current.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        inputRef.current.right = true;
        break;
      case 'ArrowUp':
      case 'KeyW':
        inputRef.current.up = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        inputRef.current.down = true;
        break;
    }
    event.preventDefault();
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        inputRef.current.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        inputRef.current.right = false;
        break;
      case 'ArrowUp':
      case 'KeyW':
        inputRef.current.up = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        inputRef.current.down = false;
        break;
    }
    event.preventDefault();
  }, []);

  // Touch input handling for mobile
  const handleTouchInput = useCallback((direction: keyof InputState, pressed: boolean) => {
    inputRef.current[direction] = pressed;
  }, []);

  // Expose touch input handler to parent
  useEffect(() => {
    (window as any).handleTouchInput = handleTouchInput;
    return () => {
      delete (window as any).handleTouchInput;
    };
  }, [handleTouchInput]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current || phase !== 'playing') return;

    const engine = gameEngineRef.current;
    const magnetActive = activePowerUps?.magnet > 0;
    const result = engine.update(inputRef.current, gameSpeed, level, activePowerUps || { shield: 0, speed: 0, magnet: 0 }, magnetActive);

    // Update power-up timers
    updatePowerUps();
    updateComboTimer();

    // Handle scoring with combo system
    if (result.scoreGained > 0) {
      addScore(result.scoreGained);
      addCombo();
      playSuccess();
    }

    // Handle power-up collection
    if (result.powerUpCollected) {
      activatePowerUp(result.powerUpCollected as 'shield' | 'speed' | 'magnet');
    }

    // Handle player hit
    if (result.hit) {
      playHit();
      loseLife();
      resetCombo();
    }

    // Render
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        engine.render(ctx);
      }
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [phase, gameSpeed, level, activePowerUps, addScore, loseLife, playHit, playSuccess, addCombo, resetCombo, updateComboTimer, activatePowerUp, updatePowerUps]);

  // Initialize game
  useEffect(() => {
    if (phase === 'playing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const { width, height } = getCanvasSize();
      
      canvas.width = width;
      canvas.height = height;
      
      gameEngineRef.current = new GameEngine(width, height);
      gameLoop();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, gameLoop]);

  // Handle game end
  useEffect(() => {
    if (phase === 'ended') {
      updateHighScore(score);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [phase, score, updateHighScore]);

  // Event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && gameEngineRef.current) {
        const { width, height } = getCanvasSize();
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        gameEngineRef.current.resize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (phase !== 'playing') return null;

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{
          border: '2px solid #4ECDC4',
          borderRadius: '8px',
          background: '#2C3E50'
        }}
      />
    </div>
  );
}
