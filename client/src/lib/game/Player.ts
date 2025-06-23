import { Vector2, GAME_CONFIG, clamp } from "../utils/gameUtils";

export class Player {
  position: Vector2;
  size: number;
  speed: number;
  color: string;
  trail: Vector2[];
  maxTrailLength: number;
  shieldActive: boolean;
  shieldPulse: number;
  invulnerabilityFrames: number;

  constructor(x: number, y: number) {
    this.position = { x, y };
    this.size = GAME_CONFIG.PLAYER_SIZE;
    this.speed = GAME_CONFIG.PLAYER_SPEED;
    this.color = GAME_CONFIG.COLORS.PLAYER;
    this.trail = [];
    this.maxTrailLength = 15;
    this.shieldActive = false;
    this.shieldPulse = 0;
  }

  update(input: { left: boolean; right: boolean; up: boolean; down: boolean }, gameSpeed: number, canvasWidth: number, canvasHeight: number, speedBoost: number = 1, cheatEffects?: any) {
    let finalSpeedBoost = speedBoost;
    
    // Apply speed cheat effects
    if (cheatEffects?.maxSpeed) finalSpeedBoost *= 2.5;
    else if (cheatEffects?.superSpeed) finalSpeedBoost *= 1.8;
    
    const adjustedSpeed = this.speed * gameSpeed * finalSpeedBoost;
    
    // Handle movement input
    if (input.left) {
      this.position.x -= adjustedSpeed;
    }
    if (input.right) {
      this.position.x += adjustedSpeed;
    }
    if (input.up) {
      this.position.y -= adjustedSpeed;
    }
    if (input.down) {
      this.position.y += adjustedSpeed;
    }

    // Keep player within canvas bounds
    this.position.x = clamp(this.position.x, this.size / 2, canvasWidth - this.size / 2);
    this.position.y = clamp(this.position.y, this.size / 2, canvasHeight - this.size / 2);

    // Update trail
    this.trail.push({ x: this.position.x, y: this.position.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
    
    // Update shield pulse
    if (this.shieldActive) {
      this.shieldPulse += 0.2;
    }
  }

  render(ctx: CanvasRenderingContext2D, cheatEffects?: any) {
    const safeCheatEffects = cheatEffects || {};
    
    // Calculate size multiplier based on cheat effects
    let sizeMultiplier = 1;
    if (safeCheatEffects.gigaPlayer) sizeMultiplier = 3;
    else if (safeCheatEffects.bigPlayer) sizeMultiplier = 2;
    else if (safeCheatEffects.tinyPlayer) sizeMultiplier = 0.5;
    else if (safeCheatEffects.microPlayer) sizeMultiplier = 0.25;
    
    const renderSize = this.size * sizeMultiplier;
    
    // Dynamic color for rainbow mode
    const playerColor = safeCheatEffects.rainbowMode 
      ? `hsl(${Date.now() * 0.01 % 360}, 100%, 50%)`
      : this.color;
    // Draw trail
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = (i / this.trail.length) * 0.3;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = playerColor;
      const trailSize = renderSize * (i / this.trail.length) * 0.8;
      ctx.beginPath();
      ctx.arc(this.trail[i].x, this.trail[i].y, trailSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw shield if active
    if (this.shieldActive) {
      ctx.globalAlpha = 0.3 + Math.sin(this.shieldPulse) * 0.2;
      ctx.strokeStyle = GAME_CONFIG.COLORS.POWERUP_SHIELD;
      ctx.lineWidth = 4 * sizeMultiplier;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, renderSize / 2 + 8 * sizeMultiplier, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = GAME_CONFIG.COLORS.POWERUP_SHIELD;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, renderSize / 2 + 8 * sizeMultiplier, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw player with enhanced cheat effects
    ctx.globalAlpha = 1;
    ctx.fillStyle = playerColor;
    ctx.strokeStyle = safeCheatEffects.rainbowMode ? 
      `hsl(${(Date.now() * 0.01 + 180) % 360}, 100%, 80%)` : '#fff';
    
    let lineWidth = 2;
    if (safeCheatEffects.gigaPlayer) lineWidth = 6;
    else if (safeCheatEffects.bigPlayer) lineWidth = 4;
    else if (safeCheatEffects.tinyPlayer) lineWidth = 1;
    else if (safeCheatEffects.microPlayer) lineWidth = 0.5;
    
    ctx.lineWidth = lineWidth;
    
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, renderSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Add enhanced glowing effect for cheat modes
    let glowIntensity = 15;
    if (safeCheatEffects.godMode) glowIntensity = 25;
    else if (safeCheatEffects.rainbowMode) glowIntensity = 20;
    else if (safeCheatEffects.gigaPlayer) glowIntensity = 30;
    
    ctx.shadowColor = playerColor;
    ctx.shadowBlur = glowIntensity * sizeMultiplier;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, renderSize / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
