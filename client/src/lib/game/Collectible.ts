import { Vector2, GAME_CONFIG } from "../utils/gameUtils";

export class Collectible {
  position: Vector2;
  size: number;
  color: string;
  value: number;
  pulsePhase: number;
  originalSize: number;

  constructor(x: number, y: number, value: number = 10) {
    this.position = { x, y };
    this.size = GAME_CONFIG.COLLECTIBLE_SIZE;
    this.originalSize = this.size;
    this.color = GAME_CONFIG.COLORS.COLLECTIBLE;
    this.value = value;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update() {
    // Pulsing animation
    this.pulsePhase += 0.1;
    this.size = this.originalSize + Math.sin(this.pulsePhase) * 2;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Draw multiple glow layers for better effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    
    // Outer glow ring
    ctx.globalAlpha = 0.3 + Math.sin(this.pulsePhase) * 0.2;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2 + 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Middle ring
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2 + 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Main collectible with animated sparkle
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Add sparkle effect
    const sparkleSize = 2 + Math.sin(this.pulsePhase * 2) * 1;
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.8 + Math.sin(this.pulsePhase * 3) * 0.2;
    ctx.beginPath();
    ctx.arc(this.position.x - 2, this.position.y - 2, sparkleSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}
