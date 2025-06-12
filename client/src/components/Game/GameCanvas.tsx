import { useEffect, useRef, useCallback } from "react";
import { useGame } from "../../lib/stores/useGame";
import { useAudio } from "../../lib/stores/useAudio";
import { GameEngine } from "../../lib/game/GameEngine";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>();

  const { phase, activePowerUps, addScore, loseLife, addCombo, updateCombo, updatePowerUps } = useGame();
  const { playSound } = useAudio();

  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Update game state
    gameEngineRef.current.update();
    updateCombo();
    updatePowerUps();

    // Render
    gameEngineRef.current.render(ctx);

    if (phase === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [phase, updateCombo, updatePowerUps]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Initialize game engine
    gameEngineRef.current = new GameEngine({
      onScore: addScore,
      onHit: loseLife,
      onCombo: addCombo,
      onSound: playSound,
      activePowerUps
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Only run once on mount

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

  useEffect(() => {
    // Update game engine with current power-ups
    if (gameEngineRef.current && activePowerUps) {
      gameEngineRef.current.updatePowerUps(activePowerUps);
    }
  }, [activePowerUps]);

  return (
    <canvas
      ref={canvasRef}
      className="block mx-auto border-2 border-gray-600 rounded-lg"
      style={{ background: 'linear-gradient(45deg, #2C3E50, #34495E)' }}
    />
  );
}