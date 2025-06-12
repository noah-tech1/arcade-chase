// Game utility functions and constants

export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  PLAYER_SIZE: 20,
  COLLECTIBLE_SIZE: 12,
  OBSTACLE_SIZE: 25,
  PLAYER_SPEED: 4,
  BASE_SPAWN_RATE: 0.02,
  OBSTACLE_SPAWN_RATE: 0.005,
  COLORS: {
    PRIMARY: '#FF6B6B',
    SECONDARY: '#4ECDC4', 
    ACCENT: '#45B7D1',
    BACKGROUND: '#2C3E50',
    SUCCESS: '#96CEB4',
    WARNING: '#FFEAA7',
    PLAYER: '#FF6B6B',
    COLLECTIBLE: '#96CEB4',
    OBSTACLE: '#FFEAA7',
    PARTICLE: '#45B7D1'
  }
};

export interface Vector2 {
  x: number;
  y: number;
}

export function distance(a: Vector2, b: Vector2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function checkCollision(a: Vector2, b: Vector2, aSize: number, bSize: number): boolean {
  return distance(a, b) < (aSize + bSize) / 2;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getCanvasSize(): { width: number; height: number } {
  const maxWidth = Math.min(window.innerWidth - 40, GAME_CONFIG.CANVAS_WIDTH);
  const maxHeight = Math.min(window.innerHeight - 200, GAME_CONFIG.CANVAS_HEIGHT);
  
  const aspectRatio = GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.CANVAS_HEIGHT;
  
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  return { width, height };
}
