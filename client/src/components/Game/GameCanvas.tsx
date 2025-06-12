
import { useEffect, useRef, useCallback } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useAudio } from "../../lib/stores/useAudio";
import { GameEngine } from "../../lib/game/GameEngine";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>();

  const { 
    phase, 
    activePowerUps, 
    addScore, 
    loseLife, 
    addCombo, 
    updateCombo, 
    updatePowerUps 
  } = useGame();
  const { playSound } = useAudio();

  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Update game state
    gameEngineRef.current.update();
    
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

    // Initialize game engine with safe defaults
    const safePowerUps = activePowerUps || {
      shield: 0,
      speed: 0,
      magnet: 0
    };

    gameEngineRef.current = new GameEngine({
      onScore: addScore,
      onHit: loseLife,
      onCombo: addCombo,
      onSound: playSound,
      activePowerUps: safePowerUps
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [addScore, loseLife, addCombo, playSound]);

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

  // Update power-ups in game engine
  useEffect(() => {
    if (gameEngineRef.current && activePowerUps) {
      gameEngineRef.current.updatePowerUps(activePowerUps);
    }
  }, [activePowerUps]);

  // Handle combo and power-up updates separately to avoid infinite loops
  useEffect(() => {
    if (phase !== "playing") return;

    const interval = setInterval(() => {
      updateCombo();
      updatePowerUps();
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <canvas
      ref={canvasRef}
      className="block mx-auto border-2 border-gray-600 rounded-lg"
      style={{ background: 'linear-gradient(45deg, #2C3E50, #34495E)' }}
    />
  );
}
