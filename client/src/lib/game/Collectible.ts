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
    // Draw glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = this.color;
    
    // Draw outer ring
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2 + 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw main collectible
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
}
