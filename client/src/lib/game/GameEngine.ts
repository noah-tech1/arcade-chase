import { Player } from "./Player";
import { Collectible } from "./Collectible";
import { Obstacle } from "./Obstacle";
import { PowerUp, PowerUpType } from "./PowerUp";
import { ParticleSystem } from "./ParticleSystem";
import { ScreenShake } from "./ScreenShake";
import { checkCollision, randomInRange, distance, GAME_CONFIG } from "../utils/gameUtils";

export class GameEngine {
  player: Player;
  collectibles: Collectible[];
  obstacles: Obstacle[];
  powerUps: PowerUp[];
  particles: ParticleSystem;
  screenShake: ScreenShake;
  canvasWidth: number;
  canvasHeight: number;
  lastSpawnTime: number;
  lastObstacleSpawn: number;
  lastPowerUpSpawn: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.player = new Player(canvasWidth / 2, canvasHeight / 2);
    this.collectibles = [];
    this.obstacles = [];
    this.powerUps = [];
    this.particles = new ParticleSystem();
    this.screenShake = new ScreenShake();
    this.lastSpawnTime = 0;
    this.lastObstacleSpawn = 0;
    this.lastPowerUpSpawn = 0;
    
    // Spawn initial collectibles
    this.spawnInitialCollectibles();
  }

  spawnInitialCollectibles() {
    for (let i = 0; i < 5; i++) {
      this.spawnCollectible();
    }
  }

  spawnCollectible() {
    let x, y;
    let attempts = 0;
    
    do {
      x = randomInRange(30, this.canvasWidth - 30);
      y = randomInRange(30, this.canvasHeight - 30);
      attempts++;
    } while (
      attempts < 50 && 
      checkCollision(this.player.position, { x, y }, this.player.size, GAME_CONFIG.COLLECTIBLE_SIZE)
    );
    
    this.collectibles.push(new Collectible(x, y));
  }

  spawnObstacle(gameSpeed: number) {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    
    const speed = randomInRange(1, 3) * gameSpeed;
    
    switch (side) {
      case 0: // Top
        x = randomInRange(0, this.canvasWidth);
        y = -GAME_CONFIG.OBSTACLE_SIZE;
        vx = randomInRange(-1, 1);
        vy = speed;
        break;
      case 1: // Right
        x = this.canvasWidth + GAME_CONFIG.OBSTACLE_SIZE;
        y = randomInRange(0, this.canvasHeight);
        vx = -speed;
        vy = randomInRange(-1, 1);
        break;
      case 2: // Bottom
        x = randomInRange(0, this.canvasWidth);
        y = this.canvasHeight + GAME_CONFIG.OBSTACLE_SIZE;
        vx = randomInRange(-1, 1);
        vy = -speed;
        break;
      case 3: // Left
        x = -GAME_CONFIG.OBSTACLE_SIZE;
        y = randomInRange(0, this.canvasHeight);
        vx = speed;
        vy = randomInRange(-1, 1);
        break;
      default:
        x = 0;
        y = 0;
        vx = 0;
        vy = 0;
    }
    
    this.obstacles.push(new Obstacle(x, y, vx, vy));
  }

  spawnPowerUp() {
    let x, y;
    let attempts = 0;
    
    do {
      x = randomInRange(50, this.canvasWidth - 50);
      y = randomInRange(50, this.canvasHeight - 50);
      attempts++;
    } while (
      attempts < 50 && 
      checkCollision(this.player.position, { x, y }, this.player.size, GAME_CONFIG.COLLECTIBLE_SIZE + 4)
    );
    
    const powerUpTypes: PowerUpType[] = ['shield', 'speed', 'magnet'];
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    this.powerUps.push(new PowerUp(x, y, randomType));
  }

  update(input: { left: boolean; right: boolean; up: boolean; down: boolean }, gameSpeed: number, level: number, activePowerUps: any, magnetActive: boolean = false): { scoreGained: number; hit: boolean; collected: number; powerUpCollected?: string } {
    let scoreGained = 0;
    let hit = false;
    let collected = 0;
    let powerUpCollected: string | undefined;
    
    // Update player shield status and speed boost
    this.player.shieldActive = activePowerUps.shield > 0;
    const speedBoost = activePowerUps.speed > 0 ? 1.8 : 1;
    
    // Update player
    this.player.update(input, gameSpeed, this.canvasWidth, this.canvasHeight, speedBoost);
    
    // Update collectibles
    for (const collectible of this.collectibles) {
      collectible.update();
      
      // Magnet effect - attract collectibles to player
      if (magnetActive && distance(this.player.position, collectible.position) < 100) {
        const dx = this.player.position.x - collectible.position.x;
        const dy = this.player.position.y - collectible.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          const pullStrength = 3;
          collectible.position.x += (dx / dist) * pullStrength;
          collectible.position.y += (dy / dist) * pullStrength;
        }
      }
    }
    
    // Update power-ups
    for (const powerUp of this.powerUps) {
      powerUp.update();
    }
    
    // Update obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      obstacle.update(this.canvasWidth, this.canvasHeight);
      
      // Remove obstacles that are too far off screen
      if (obstacle.position.x < -100 || obstacle.position.x > this.canvasWidth + 100 ||
          obstacle.position.y < -100 || obstacle.position.y > this.canvasHeight + 100) {
        this.obstacles.splice(i, 1);
      }
    }
    
    // Update particles
    this.particles.update();
    
    // Update screen shake
    this.screenShake.update();
    
    // Check collectible collisions
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const collectible = this.collectibles[i];
      if (checkCollision(this.player.position, collectible.position, this.player.size, collectible.size)) {
        scoreGained += collectible.value;
        collected++;
        
        // Create enhanced collection particle effect
        this.particles.createCollectionBurst(
          collectible.position.x,
          collectible.position.y,
          GAME_CONFIG.COLORS.SUCCESS
        );
        
        this.collectibles.splice(i, 1);
        this.spawnCollectible();
      }
    }
    
    // Check power-up collisions
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      if (checkCollision(this.player.position, powerUp.position, this.player.size, powerUp.size)) {
        powerUpCollected = powerUp.type;
        
        // Create power-up collection particle effect
        this.particles.createPowerUpEffect(
          powerUp.position.x,
          powerUp.position.y,
          powerUp.color
        );
        
        this.powerUps.splice(i, 1);
      }
    }
    
    // Check obstacle collisions
    for (const obstacle of this.obstacles) {
      if (checkCollision(this.player.position, obstacle.position, this.player.size, obstacle.size)) {
        hit = true;
        
        // Start screen shake effect
        this.screenShake.start(8, 20);
        
        // Create hit particle effect
        this.particles.createExplosion(
          this.player.position.x,
          this.player.position.y,
          GAME_CONFIG.COLORS.PRIMARY,
          12
        );
        break;
      }
    }
    
    // Spawn new collectibles periodically
    const now = Date.now();
    if (now - this.lastSpawnTime > 2500 && this.collectibles.length < 10) {
      this.spawnCollectible();
      this.lastSpawnTime = now;
    }
    
    // Spawn obstacles based on level
    const obstacleSpawnRate = GAME_CONFIG.OBSTACLE_SPAWN_RATE * (1 + level * 0.4);
    if (now - this.lastObstacleSpawn > 1800 && Math.random() < obstacleSpawnRate) {
      this.spawnObstacle(gameSpeed);
      this.lastObstacleSpawn = now;
    }
    
    // Spawn power-ups occasionally
    if (now - this.lastPowerUpSpawn > 15000 && this.powerUps.length < 2 && Math.random() < GAME_CONFIG.POWERUP_SPAWN_RATE) {
      this.spawnPowerUp();
      this.lastPowerUpSpawn = now;
    }
    
    return { scoreGained, hit, collected, powerUpCollected };
  }

  render(ctx: CanvasRenderingContext2D) {
    // Create animated starfield background
    const time = Date.now() * 0.001;
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, GAME_CONFIG.COLORS.BACKGROUND);
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Animated stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % this.canvasWidth;
      const y = (i * 71) % this.canvasHeight;
      const twinkle = Math.sin(time * 2 + i * 0.5) * 0.5 + 0.5;
      ctx.globalAlpha = twinkle * 0.6 + 0.2;
      const size = Math.sin(i) * 1.5 + 1;
      ctx.fillRect(x, y, size, size);
    }
    
    // Moving grid pattern
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = 'rgba(78, 205, 196, 0.3)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    const offset = (time * 20) % gridSize;
    
    for (let x = -offset; x <= this.canvasWidth + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvasHeight);
      ctx.stroke();
    }
    
    for (let y = -offset; y <= this.canvasHeight + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasWidth, y);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    
    // Apply screen shake offset
    const shakeOffset = this.screenShake.getOffset();
    ctx.save();
    ctx.translate(shakeOffset.x, shakeOffset.y);
    
    // Render particles (behind everything)
    this.particles.render(ctx);
    
    // Render collectibles
    for (const collectible of this.collectibles) {
      collectible.render(ctx);
    }
    
    // Render power-ups
    for (const powerUp of this.powerUps) {
      powerUp.render(ctx);
    }
    
    // Render obstacles
    for (const obstacle of this.obstacles) {
      obstacle.render(ctx);
    }
    
    // Render player (on top)
    this.player.render(ctx);
    
    ctx.restore();
  }

  resize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    
    // Keep player in bounds after resize
    this.player.position.x = Math.min(this.player.position.x, width - this.player.size / 2);
    this.player.position.y = Math.min(this.player.position.y, height - this.player.size / 2);
  }
}
