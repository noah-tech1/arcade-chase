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
- June 23, 2025. Enhanced cheat system with GUI menu and passcode protection

## Recent Changes
- Added comprehensive cheat menu with passcode protection (7456660641)
- Enhanced cheat effects including extra lives, size variations, and scoring multipliers
- Fixed cheat system implementation to ensure all effects work properly
- Integrated auto-collect magnet functionality with visual feedback
- Implemented personal high score system saved in cookies/localStorage
- Added all-time high score tracking and leaderboard with top 10 scores
- Created player name editing functionality and enhanced game over notifications
- Fixed auto-collect cheat to work independently with enhanced range and pull strength
- Resolved cheat power-up system to work immediately without requiring legitimate power-ups first
- Fixed invincibility system for both legitimate shields and cheat effects (god mode, infinite lives)
- Fixed power-up duration system: shields last 5 seconds, other power-ups last 8 seconds
- Removed all console.log statements and debug code for production deployment
- Added SEO meta tags and optimized build configuration for deployment
- Implemented proper error handling and audio fallbacks
- Fixed god mode cheat by ensuring real-time state retrieval from store instead of stale props
- Cleaned up debug logging for production readiness
- Fixed leaderboard duplicate entries - players now have single entry with their highest score
- Added cleanup function to remove existing duplicates from leaderboard
- Implemented PostgreSQL database integration for persistent leaderboard storage
- Created API endpoints for leaderboard operations (GET, POST, cleanup)
- Added database service layer with Drizzle ORM for type-safe database operations
- Enhanced leaderboard with fallback to localStorage for offline functionality
- Created React Native mobile app version using Expo for iOS/Android deployment
- Implemented touch gesture controls for mobile gameplay
- Added mobile-optimized UI and performance optimizations
- Configured app store deployment pipeline with EAS Build
- Enhanced mobile app with 60fps gameplay, haptic feedback, and smooth touch controls
- Added comprehensive power-up system (shield, magnet, double score)
- Implemented auto-pause, high score persistence, and offline functionality
- Added combo system, level progression, and enhanced visual effects
- Optimized web version for better mobile performance and touch responsiveness
- Created production-ready APK build system with detailed deployment guide
- Implemented advanced virtual joystick with professional features
- Redesigned leaderboard with premium "Hall of Fame" interface and automated duplicate cleanup
- Enhanced sound system with Web Audio API generated effects (hit, collect, power-up, level-up, game-over, high-score)
- Added comprehensive settings modal with audio controls, volume slider, and performance tips
- Improved mobile responsiveness with better touch controls and visual feedback
- Added in-game audio toggle and enhanced UI polish for both web and mobile users
- Implemented background ambient music and movement sound effects for immersive gameplay experience
- Enhanced audio system with rich background noise, harmonic layers, and specialized sound effects for different power-ups and game events
- Implemented advanced audio features: adaptive soundscape generator, dynamic layering system, immersive ambient noise engine with reverb and filtering, procedural sound synthesis with distortion and echo effects
- Added comprehensive user authentication system with login/register functionality, password hashing, and session management
- Integrated user accounts with leaderboard system for persistent high score tracking across sessions
- Enhanced StartScreen with authentication UI, user status display, and account management features
- Implemented comprehensive game enhancements: combo multiplier system, enhanced visual effects, animated background stars
- Added dynamic player ship design with directional rotation and thruster particle effects
- Enhanced collectible system with improved rarity distribution: Common (40%, 15pts), Rare (40%, 50pts), Epic (20%, 125pts)
- Upgraded visual effects for rare/epic items with enhanced sparkles, multi-layer glows, and dramatic particle explosions
- Improved obstacle design with procedural spiky shapes and dynamic pulse animations
- Upgraded particle system with enhanced explosion effects, collection bursts, and improved rendering
- Added combo timer UI with animated progress bar and glowing effects for sustained collection streaks
- Created Chrome extension version with complete game functionality, offline play, and local high score storage
- Built downloadable ZIP package with installation instructions and optimized 800x600 popup interface
- Successfully converted APK download system to Chrome Extension ZIP format with working download functionality
- Simplified user interface with single "DOWNLOAD ZIP" button and QR code modal for easy access
- Verified Chrome Extension installation works correctly in browser environment
- Fixed Chrome Extension icon loading issues by creating required PNG icon files (16x16, 32x32, 48x48, 128x128)
- Updated Chrome Extension ZIP package with proper manifest compliance and icon support
- Enhanced animated loading transitions with 4 transition types: fadeIn, slideDown, scale, and spin effects
- Implemented LoadingScreen component with multi-ring spinner, progress bar, and floating particle animations
- Added seamless 600ms transition duration between game screens for improved user experience
- Completely rebuilt Chrome extension with full cheat system matching web version functionality
- Added comprehensive cheat menu with 18 different cheat effects across 5 categories (Movement, Size, Scoring, Survival, Gameplay)
- Implemented passcode protection system (7456660641) activated by pressing '8' during gameplay
- Added all cheat effects: god mode, speed variations, player size changes, scoring multipliers, auto-collect, rainbow mode
- Enhanced visual effects with rainbow mode affecting all game elements (player, collectibles, obstacles, background)
- Updated Chrome extension ZIP package (13,269 bytes) with complete feature parity to web version
- Fixed all button functionality and game controls for seamless Chrome extension experience
- Converted web app to Progressive Web App (PWA) with full mobile optimization
- Added PWA manifest, service worker, and offline functionality for installable mobile experience
- Implemented comprehensive mobile features: virtual touch controls, Wake Lock API, haptic feedback
- Created app update prompts, splash screen with launch animation, and offline progress saving
- Added mobile-specific utilities: virtual controls manager, haptic feedback patterns, offline storage
- Enhanced service worker with background sync, push notifications, and app update handling
- Integrated PWA install prompts, network status monitoring, and mobile-optimized interface

## User Preferences

Preferred communication style: Simple, everyday language.
Cheat system: GUI menu preferred over text commands, protected with custom passcode.