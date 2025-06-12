import { Vector2, GAME_CONFIG } from "../utils/gameUtils";

export class Obstacle {
  position: Vector2;
  velocity: Vector2;
  size: number;
  color: string;
  rotationSpeed: number;
  rotation: number;

  constructor(x: number, y: number, vx: number = 0, vy: number = 0) {
    this.position = { x, y };
    this.velocity = { x: vx, y: vy };
    this.size = GAME_CONFIG.OBSTACLE_SIZE;
    this.color = GAME_CONFIG.COLORS.OBSTACLE;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    this.rotation = 0;
  }

  update(canvasWidth: number, canvasHeight: number) {
    // Update position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    
    // Update rotation
    this.rotation += this.rotationSpeed;
    
    // Bounce off walls
    if (this.position.x <= this.size / 2 || this.position.x >= canvasWidth - this.size / 2) {
      this.velocity.x *= -1;
      this.position.x = Math.max(this.size / 2, Math.min(canvasWidth - this.size / 2, this.position.x));
    }
    
    if (this.position.y <= this.size / 2 || this.position.y >= canvasHeight - this.size / 2) {
      this.velocity.y *= -1;
      this.position.y = Math.max(this.size / 2, Math.min(canvasHeight - this.size / 2, this.position.y));
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    
    // Draw warning glow
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    
    // Draw diamond shape
    const halfSize = this.size / 2;
    ctx.beginPath();
    ctx.moveTo(0, -halfSize);
    ctx.lineTo(halfSize, 0);
    ctx.lineTo(0, halfSize);
    ctx.lineTo(-halfSize, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}
