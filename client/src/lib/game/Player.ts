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

  update(input: { left: boolean; right: boolean; up: boolean; down: boolean }, gameSpeed: number, canvasWidth: number, canvasHeight: number, speedBoost: number = 1) {
    const adjustedSpeed = this.speed * gameSpeed * speedBoost;
    
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

  render(ctx: CanvasRenderingContext2D) {
    // Draw trail
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = (i / this.trail.length) * 0.3;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      const trailSize = this.size * (i / this.trail.length) * 0.8;
      ctx.beginPath();
      ctx.arc(this.trail[i].x, this.trail[i].y, trailSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw shield if active
    if (this.shieldActive) {
      ctx.globalAlpha = 0.3 + Math.sin(this.shieldPulse) * 0.2;
      ctx.strokeStyle = GAME_CONFIG.COLORS.POWERUP_SHIELD;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.size / 2 + 8, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = GAME_CONFIG.COLORS.POWERUP_SHIELD;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.size / 2 + 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw player
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Add a glowing effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
