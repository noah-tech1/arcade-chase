# Collectible Rarity System Guide

## How the Rarity System Works

The game features a sophisticated collectible rarity system with three tiers of items, each with unique visual effects and point values.

### Rarity Tiers

#### 1. Common Items (70% spawn chance)
- **Color**: Cyan (#4ECDC4)
- **Points**: 10 points
- **Size**: 8 pixels
- **Visual Effects**: 
  - Basic pulsing glow
  - Standard particle burst on collection
  - Simple white core highlight

#### 2. Rare Items (20% spawn chance)
- **Color**: Purple (#9B59B6)
- **Points**: 25 points (2.5x common)
- **Size**: 10 pixels
- **Visual Effects**:
  - Enhanced glow with higher intensity
  - Sparkle effects with rotating white dots
  - Purple particle burst with more particles
  - Larger collection explosion

#### 3. Epic Items (10% spawn chance)
- **Color**: Gold (#FFD700)
- **Points**: 50 points (5x common)
- **Size**: 12 pixels
- **Visual Effects**:
  - Maximum glow intensity
  - Multiple sparkle effects in cross pattern
  - Golden particle explosion with 12 particles
  - Largest and most dramatic collection burst

### Technical Implementation

#### Spawn Logic (GameEngine.ts)
```typescript
spawnCollectible() {
  // Enhanced collectible types with different rarities
  const rarity = Math.random();
  let value, type;
  
  if (rarity < 0.7) {
    // Common (70%)
    value = 10;
    type = 'common';
  } else if (rarity < 0.9) {
    // Rare (20%)
    value = 25;
    type = 'rare';
  } else {
    // Epic (10%)
    value = 50;
    type = 'epic';
  }
  
  const collectible = new Collectible(x, y, value);
  collectible.type = type;
  this.collectibles.push(collectible);
}
```

#### Visual Effects (Collectible.ts)
```typescript
render(ctx: CanvasRenderingContext2D) {
  // Enhanced glow effect based on rarity
  const glowSize = this.size + (this.glowIntensity * 8);
  ctx.shadowBlur = 20 + (this.glowIntensity * 10);
  
  // Add sparkle effects for rare/epic items
  if (this.type !== 'common') {
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = this.glowIntensity;
    for (let i = 0; i < 4; i++) {
      const angle = (this.pulsePhase + i * Math.PI / 2);
      const sparkleX = this.position.x + Math.cos(angle) * (this.size * 0.7);
      const sparkleY = this.position.y + Math.sin(angle) * (this.size * 0.7);
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
```

#### Particle Effects (GameEngine.ts)
```typescript
// Enhanced particle effects based on rarity
if (collectible.type === 'epic') {
  this.particles.createExplosion(collectible.position.x, collectible.position.y, '#FFD700', 12);
  this.particles.createCollectionBurst(collectible.position.x, collectible.position.y, '#FFD700');
} else if (collectible.type === 'rare') {
  this.particles.createExplosion(collectible.position.x, collectible.position.y, '#9B59B6', 8);
  this.particles.createCollectionBurst(collectible.position.x, collectible.position.y, '#9B59B6');
} else {
  this.particles.createCollectionBurst(collectible.position.x, collectible.position.y, collectible.color);
}
```

### Gameplay Strategy

- **Common items** form the backbone of scoring, appearing frequently
- **Rare items** provide strategic value boosts worth seeking out
- **Epic items** are rare treasures that can significantly boost your score
- The combo system multiplies ALL item values, making rare items even more valuable during combos
- Players learn to recognize the visual cues and prioritize higher-value items

### Visual Recognition

Players can instantly identify rarity by:
1. **Color** - Cyan (common), Purple (rare), Gold (epic)
2. **Size** - Progressively larger for higher rarities
3. **Sparkles** - Only rare and epic items have rotating sparkle effects
4. **Glow intensity** - More intense glow for rarer items

This system adds depth and excitement to collection gameplay, encouraging players to take strategic risks for higher-value items while maintaining steady collection of common items.