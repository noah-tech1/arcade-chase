// Arcade Collector Game - Chrome Extension Version
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Player {
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.size = 20;
        this.speed = 5;
        this.color = '#4ECDC4';
    }

    update(input, canvasWidth, canvasHeight) {
        if (input.left && this.position.x > this.size / 2) {
            this.position.x -= this.speed;
        }
        if (input.right && this.position.x < canvasWidth - this.size / 2) {
            this.position.x += this.speed;
        }
        if (input.up && this.position.y > this.size / 2) {
            this.position.y -= this.speed;
        }
        if (input.down && this.position.y < canvasHeight - this.size / 2) {
            this.position.y += this.speed;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Collectible {
    constructor(x, y, value = 15) {
        this.position = new Vector2(x, y);
        this.size = 12;
        this.originalSize = this.size;
        this.value = value;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.type = 'common';
        this.glowIntensity = 0.4;
        
        // Enhanced rarity system - more rare/epic items, better rewards
        const rarity = Math.random();
        if (rarity < 0.4) {
            // Common (40%)
            this.color = '#4ECDC4'; // Cyan
            this.value = 15;
            this.type = 'common';
        } else if (rarity < 0.8) {
            // Rare (40%)
            this.color = '#9B59B6'; // Purple
            this.value = 50;
            this.type = 'rare';
            this.size = 15;
            this.originalSize = 15;
        } else {
            // Epic (20%)
            this.color = '#FFD700'; // Gold
            this.value = 125;
            this.type = 'epic';
            this.size = 18;
            this.originalSize = 18;
        }
    }

    update() {
        const pulseSpeed = this.type === 'epic' ? 0.15 : this.type === 'rare' ? 0.12 : 0.1;
        this.pulsePhase += pulseSpeed;
        
        const pulseIntensity = this.type === 'epic' ? 4 : this.type === 'rare' ? 3 : 2;
        this.size = this.originalSize + Math.sin(this.pulsePhase) * pulseIntensity;
        
        this.glowIntensity = (Math.sin(this.pulsePhase * 2) + 1) * 0.5;
        if (this.type === 'epic') this.glowIntensity *= 1.5;
        else if (this.type === 'rare') this.glowIntensity *= 1.2;
    }

    render(ctx) {
        ctx.save();
        
        const baseGlow = this.type === 'epic' ? 35 : this.type === 'rare' ? 25 : 20;
        ctx.shadowBlur = baseGlow + (this.glowIntensity * 15);
        ctx.shadowColor = this.color;
        
        // Main collectible
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Enhanced sparkle effects
        if (this.type === 'epic') {
            ctx.fillStyle = '#FFFFFF';
            ctx.globalAlpha = this.glowIntensity;
            for (let i = 0; i < 8; i++) {
                const angle = (this.pulsePhase + i * Math.PI / 4);
                const distance = this.size * 0.8;
                const sparkleX = this.position.x + Math.cos(angle) * distance;
                const sparkleY = this.position.y + Math.sin(angle) * distance;
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.type === 'rare') {
            ctx.fillStyle = '#FFFFFF';
            ctx.globalAlpha = this.glowIntensity;
            for (let i = 0; i < 6; i++) {
                const angle = (this.pulsePhase + i * Math.PI / 3);
                const distance = this.size * 0.7;
                const sparkleX = this.position.x + Math.cos(angle) * distance;
                const sparkleY = this.position.y + Math.sin(angle) * distance;
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }
}

class Obstacle {
    constructor(x, y, vx = 0, vy = 0) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(vx, vy);
        this.size = 25;
        this.color = '#FF6B6B';
        this.rotation = 0;
        this.rotationSpeed = 0.05;
    }

    update(canvasWidth, canvasHeight) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.rotation += this.rotationSpeed;

        // Bounce off walls
        if (this.position.x <= this.size / 2 || this.position.x >= canvasWidth - this.size / 2) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y <= this.size / 2 || this.position.y >= canvasHeight - this.size / 2) {
            this.velocity.y = -this.velocity.y;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = new Player(canvas.width / 2, canvas.height / 2);
        this.collectibles = [];
        this.obstacles = [];
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameState = 'start';
        this.highScore = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.lastCollectionTime = 0;
        
        this.input = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        this.setupInitialObjects();
        this.loadHighScore(); // This is now async but we don't need to await it
        this.bindEvents();
    }

    async loadHighScore() {
        try {
            // Try Chrome extension storage first
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.local.get(['arcadeCollectorHighScore']);
                this.highScore = result.arcadeCollectorHighScore || 0;
            } else {
                // Fallback to localStorage
                const saved = localStorage.getItem('arcadeCollectorHighScore');
                this.highScore = saved ? parseInt(saved) : 0;
            }
        } catch (error) {
            // Fallback to localStorage if Chrome storage fails
            const saved = localStorage.getItem('arcadeCollectorHighScore');
            this.highScore = saved ? parseInt(saved) : 0;
        }
    }

    async saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            
            try {
                // Try Chrome extension storage first
                if (typeof chrome !== 'undefined' && chrome.storage) {
                    await chrome.storage.local.set({ 
                        arcadeCollectorHighScore: this.highScore 
                    });
                } else {
                    // Fallback to localStorage
                    localStorage.setItem('arcadeCollectorHighScore', this.highScore.toString());
                }
            } catch (error) {
                // Fallback to localStorage if Chrome storage fails
                localStorage.setItem('arcadeCollectorHighScore', this.highScore.toString());
            }
        }
    }

    setupInitialObjects() {
        for (let i = 0; i < 8; i++) {
            this.spawnCollectible();
        }
        
        for (let i = 0; i < 3; i++) {
            this.spawnObstacle();
        }
    }

    spawnCollectible() {
        const x = Math.random() * (this.canvas.width - 60) + 30;
        const y = Math.random() * (this.canvas.height - 60) + 30;
        this.collectibles.push(new Collectible(x, y));
    }

    spawnObstacle() {
        const side = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        const speed = 1 + this.level * 0.3;

        switch (side) {
            case 0: // Top
                x = Math.random() * this.canvas.width;
                y = -25;
                vx = (Math.random() - 0.5) * 2;
                vy = speed;
                break;
            case 1: // Right
                x = this.canvas.width + 25;
                y = Math.random() * this.canvas.height;
                vx = -speed;
                vy = (Math.random() - 0.5) * 2;
                break;
            case 2: // Bottom
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + 25;
                vx = (Math.random() - 0.5) * 2;
                vy = -speed;
                break;
            case 3: // Left
                x = -25;
                y = Math.random() * this.canvas.height;
                vx = speed;
                vy = (Math.random() - 0.5) * 2;
                break;
        }

        this.obstacles.push(new Obstacle(x, y, vx, vy));
    }

    checkCollision(obj1, obj2, size1, size2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (size1 + size2) / 2;
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.player.update(this.input, this.canvas.width, this.canvas.height);
        this.collectibles.forEach(collectible => collectible.update());
        this.obstacles.forEach(obstacle => obstacle.update(this.canvas.width, this.canvas.height));

        // Check collectible collisions
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            if (this.checkCollision(this.player.position, collectible.position, this.player.size, collectible.size)) {
                let points = collectible.value;
                
                // Apply combo multiplier
                const currentTime = Date.now();
                if (currentTime - this.lastCollectionTime < 1000) {
                    this.combo = Math.min(this.combo + 1, 4);
                } else {
                    this.combo = 1;
                }
                this.lastCollectionTime = currentTime;
                this.comboTimer = 3000;
                
                points *= this.combo;
                this.score += points;
                
                this.collectibles.splice(i, 1);
                this.spawnCollectible();
                
                if (this.score >= this.level * 500) {
                    this.level++;
                    if (this.obstacles.length < 8) {
                        this.spawnObstacle();
                    }
                }
            }
        }

        // Check obstacle collisions
        for (const obstacle of this.obstacles) {
            if (this.checkCollision(this.player.position, obstacle.position, this.player.size, obstacle.size)) {
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver();
                    return;
                } else {
                    this.player.position.x = this.canvas.width / 2;
                    this.player.position.y = this.canvas.height / 2;
                }
                break;
            }
        }

        if (this.comboTimer > 0) {
            this.comboTimer -= 16;
            if (this.comboTimer <= 0) {
                this.combo = 0;
            }
        }

        this.obstacles = this.obstacles.filter(obstacle => {
            return obstacle.position.x > -50 && obstacle.position.x < this.canvas.width + 50 &&
                   obstacle.position.y > -50 && obstacle.position.y < this.canvas.height + 50;
        });

        if (Math.random() < 0.002 * this.level && this.obstacles.length < 8) {
            this.spawnObstacle();
        }
    }

    render() {
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameState !== 'playing' && this.gameState !== 'paused') return;

        this.collectibles.forEach(collectible => collectible.render(this.ctx));
        this.obstacles.forEach(obstacle => obstacle.render(this.ctx));
        this.player.render(this.ctx);
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.input.up = true;
                    e.preventDefault();
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.input.down = true;
                    e.preventDefault();
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    this.input.left = true;
                    e.preventDefault();
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.input.right = true;
                    e.preventDefault();
                    break;
                case 'KeyP':
                    this.togglePause();
                    e.preventDefault();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.input.up = false;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.input.down = false;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    this.input.left = false;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.input.right = false;
                    break;
            }
        });
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseIndicator').style.display = 'block';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseIndicator').style.display = 'none';
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.combo = 0;
        this.comboTimer = 0;
        
        this.player.position.x = this.canvas.width / 2;
        this.player.position.y = this.canvas.height / 2;
        
        this.collectibles = [];
        this.obstacles = [];
        this.setupInitialObjects();
        
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.saveHighScore();
        
        document.getElementById('finalScore').textContent = `Final Score: ${this.score.toLocaleString()}`;
        document.getElementById('highScore').textContent = `High Score: ${this.highScore.toLocaleString()}`;
        document.getElementById('gameOverScreen').style.display = 'flex';
    }

    updateUI() {
        document.getElementById('score').textContent = `Score: ${this.score.toLocaleString()}`;
        document.getElementById('level').textContent = `Level: ${this.level}`;
        document.getElementById('lives').textContent = `Lives: ${this.lives}`;
        
        const comboDisplay = document.getElementById('comboDisplay');
        if (this.combo > 1 && this.comboTimer > 0) {
            comboDisplay.style.display = 'block';
            document.getElementById('comboMultiplier').textContent = `x${this.combo}`;
        } else {
            comboDisplay.style.display = 'none';
        }
    }

    gameLoop() {
        this.update();
        this.render();
        this.updateUI();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Game initialization
let game;

function initGame() {
    console.log('Initializing game...');
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    game = new GameEngine(canvas);
    game.gameLoop();
    
    // Add backup event listeners for buttons in case onclick doesn't work
    const buttons = document.querySelectorAll('.game-button');
    buttons.forEach(button => {
        const text = button.textContent.trim();
        console.log('Setting up button:', text);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Button clicked:', text);
            
            switch(text) {
                case 'START GAME':
                    startGame();
                    break;
                case 'HOW TO PLAY':
                    showInstructions();
                    break;
                case 'PLAY AGAIN':
                    restartGame();
                    break;
                case 'MAIN MENU':
                    showStartScreen();
                    break;
                default:
                    console.log('Unknown button:', text);
            }
        });
    });
    
    console.log('Game initialized successfully');
}

function startGame() {
    console.log('Start game button clicked');
    if (!game) {
        console.error('Game not initialized!');
        return;
    }
    game.startGame();
    console.log('Game started');
}

function restartGame() {
    console.log('Restart game button clicked');
    if (!game) {
        console.error('Game not initialized!');
        return;
    }
    game.startGame();
    console.log('Game restarted');
}

function showStartScreen() {
    console.log('Show start screen button clicked');
    if (!game) {
        console.error('Game not initialized!');
        return;
    }
    game.gameState = 'start';
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('gameOverScreen').style.display = 'none';
    console.log('Start screen shown');
}

function showInstructions() {
    alert(`HOW TO PLAY ARCADE COLLECTOR:

🎮 CONTROLS:
• WASD or Arrow Keys to move
• P to pause/unpause

🎯 OBJECTIVE:
• Collect glowing items to score points
• Avoid red obstacles
• Survive as long as possible

💎 COLLECTIBLES:
• Cyan items: 15 points (Common - 40%)
• Purple items: 50 points (Rare - 40%)
• Gold items: 125 points (Epic - 20%)

⚡ COMBO SYSTEM:
• Collect items quickly for combo multipliers
• Up to 4x multiplier bonus
• Higher combos = higher scores

🚀 PROGRESSION:
• Every 500 points = new level
• Higher levels = more obstacles
• Challenge yourself to beat your high score!`);
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    setTimeout(initGame, 100); // Small delay to ensure all elements are ready
});

// Fallback initialization if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('DOM is loading, waiting for DOMContentLoaded');
} else {
    console.log('DOM already loaded, initializing immediately');
    setTimeout(initGame, 100);
}