# Arcade Collector - Retro Game

## Overview

This is a browser-based arcade-style collectible game built with React, TypeScript, and Express. The game features a retro aesthetic where players control a character to collect items while avoiding obstacles, with progressively increasing difficulty and various power-ups.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom game-specific styles
- **State Management**: Zustand for game state, audio, and high scores
- **3D Graphics**: React Three Fiber and Drei (though primarily 2D canvas-based game)
- **UI Components**: Radix UI components with custom styling
- **Build Tool**: Vite with custom configuration for game assets

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Development**: Hot reload with Vite integration
- **Storage**: In-memory storage with interface for future database integration
- **API**: RESTful endpoints (routes defined but minimal implementation)

### Game Engine
- **Rendering**: HTML5 Canvas with 2D context
- **Physics**: Custom collision detection and movement systems
- **Entity System**: Modular game objects (Player, Collectibles, Obstacles, PowerUps)
- **Particle Effects**: Custom particle system for visual feedback
- **Audio**: Web Audio API integration with sound effects

## Key Components

### Game Engine Classes
1. **GameEngine**: Core game loop and entity management
2. **Player**: Player character with movement and collision
3. **Collectible**: Collectible items with pulsing animations
4. **Obstacle**: Moving obstacles with bounce physics
5. **PowerUp**: Special items providing temporary abilities
6. **ParticleSystem**: Visual effects for game events
7. **ScreenShake**: Camera shake effects for impact feedback

### State Management
- **useGame**: Core game state (score, level, lives, power-ups)
- **useAudio**: Audio control and sound effect management
- **useHighScore**: Persistent high score storage using localStorage

### UI Components
- **GameCanvas**: Main game rendering component
- **StartScreen**: Game introduction and start interface
- **GameOverScreen**: End game statistics and restart
- **TouchControls**: Mobile-friendly touch input system
- **GameUI**: HUD elements (score, lives, power-ups)

## Data Flow

1. **Game Initialization**: Canvas setup, game engine creation, input binding
2. **Game Loop**: Update entities → Check collisions → Render frame → Request next frame
3. **State Updates**: Game events trigger Zustand state changes
4. **Audio Feedback**: State changes trigger appropriate sound effects
5. **Persistence**: High scores saved to localStorage automatically

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Three Fiber
- **State Management**: Zustand with persistence middleware
- **Styling**: Tailwind CSS, PostCSS, class-variance-authority
- **UI Library**: Radix UI component collection
- **Fonts**: Google Fonts (Press Start 2P, Orbitron)

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full type checking and compilation
- **Development Server**: tsx for server development

### Database Integration
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: Neon serverless PostgreSQL (configured but not actively used)
- **Migrations**: Drizzle Kit for schema management

## Deployment Strategy

### Development
- **Local Server**: `npm run dev` starts both frontend and backend
- **Hot Reload**: Vite middleware for instant updates
- **Port Configuration**: Server runs on port 5000

### Production
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Deployment Target**: Replit autoscale deployment
- **Asset Handling**: Static files served from dist/public
- **Environment**: NODE_ENV=production for optimization

### Replit Configuration
- **Runtime**: Node.js 20 with Nix package management
- **Auto-deployment**: Configured for seamless deployment
- **Port Mapping**: Internal port 5000 mapped to external port 80

## Changelog
- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.