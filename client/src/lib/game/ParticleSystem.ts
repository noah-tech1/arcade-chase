import { Vector2, GAME_CONFIG, randomInRange } from "../utils/gameUtils";

interface Particle {
  position: Vector2;
  velocity: Vector2;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export class ParticleSystem {
  particles: Particle[];

  constructor() {
    this.particles = [];
  }

  createExplosion(x: number, y: number, color: string, count: number = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + randomInRange(-0.3, 0.3);
      const speed = randomInRange(2, 6);
      
      this.particles.push({
        position: { x, y },
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        life: 60,
        maxLife: 60,
        size: randomInRange(3, 8),
        color
      });
    }
  }

  createTrail(x: number, y: number, color: string) {
    this.particles.push({
      position: { x: x + randomInRange(-5, 5), y: y + randomInRange(-5, 5) },
      velocity: { x: randomInRange(-1, 1), y: randomInRange(-1, 1) },
      life: 30,
      maxLife: 30,
      size: randomInRange(2, 4),
      color
    });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update position
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      
      // Apply gravity/friction
      particle.velocity.y += 0.1;
      particle.velocity.x *= 0.98;
      particle.velocity.y *= 0.98;
      
      // Update life
      particle.life--;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (const particle of this.particles) {
      const alpha = particle.life / particle.maxLife;
      const size = particle.size * alpha;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 5;
      
      ctx.beginPath();
      ctx.arc(particle.position.x, particle.position.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}
