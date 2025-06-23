import React, { useRef, useEffect, useState } from 'react';
import { View, Dimensions, PanGestureHandler, State } from 'react-native';
import { GLView } from 'expo-gl';
import { GameEngine } from '../lib/game/GameEngine';
import { useGame } from '../lib/stores/useGame';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GameCanvas() {
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>();
  const [gl, setGL] = useState<WebGLRenderingContext | null>(null);
  const { phase, score, level, gameSpeed, activePowerUps, activeCheatEffects } = useGame();
  
  const inputRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  // Initialize game engine
  useEffect(() => {
    if (gl && !gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(screenWidth, screenHeight);
    }
  }, [gl]);

  // Game loop
  const gameLoop = () => {
    if (!gameEngineRef.current || !gl || phase !== "playing") return;

    // Update game
    const result = gameEngineRef.current.update(
      inputRef.current,
      gameSpeed,
      level,
      activePowerUps,
      activeCheatEffects?.autoCollect || false,
      activeCheatEffects
    );

    // Render
    gameEngineRef.current.render(gl as any, activeCheatEffects);
    
    // Present the rendered frame
    gl.endFrameEXP();

    if (phase === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    if (phase === "playing" && gl) {
      gameLoop();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, gl]);

  // Handle touch gestures for movement
  const onGestureEvent = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    
    // Reset all inputs
    inputRef.current = { left: false, right: false, up: false, down: false };
    
    // Set direction based on gesture
    const threshold = 10;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > threshold) inputRef.current.right = true;
      if (translationX < -threshold) inputRef.current.left = true;
    } else {
      if (translationY > threshold) inputRef.current.down = true;
      if (translationY < -threshold) inputRef.current.up = true;
    }
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      inputRef.current = { left: false, right: false, up: false, down: false };
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <GLView
          style={{ width: screenWidth, height: screenHeight }}
          onContextCreate={setGL}
        />
      </PanGestureHandler>
    </View>
  );
}