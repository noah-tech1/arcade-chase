# 📱 Build APK Guide - Arcade Collector

## Quick APK Build (5 minutes)

### Prerequisites
```bash
npm install -g @expo/cli eas-cli
```

### 1. Navigate to Mobile App
```bash
cd mobile-app
```

### 2. Login to Expo
```bash
eas login
# Use your Expo account or create one at expo.dev
```

### 3. Build APK for Android
```bash
eas build -p android --profile preview
```

This will:
- Build a standalone APK file
- Work offline (no internet required after install)  
- Take 5-10 minutes to complete
- Provide download link when finished

### 4. Download and Install
1. Copy the APK download link from terminal
2. Download on your Android device
3. Enable "Install from Unknown Sources" in Android settings
4. Install the APK file

## Enhanced Mobile Features

### 🎮 Gameplay Improvements
- **Smooth 60fps gameplay** with optimized game loop
- **Haptic feedback** for collisions and power-ups
- **Enhanced touch controls** with momentum and friction
- **Auto-pause** when app goes to background
- **Portrait orientation lock** for consistent experience

### 🔋 Power-Up System
- **Shield** (green) - 5 seconds of invincibility
- **Magnet** (purple) - Attracts collectibles automatically  
- **Double Score** (orange) - 2x points for 8 seconds

### 📊 Enhanced UI
- **Combo system** - Chain collectibles for bonus text
- **Level progression** - Difficulty increases every 500 points
- **High score persistence** - Saves locally, works offline
- **FPS counter** (unlocked with cheat code)
- **Visual power-up indicators** on player

### 🎯 Cheat System
- Same passcode: **7456660641**
- **God mode** with golden player appearance
- **Enhanced movement** and collision immunity
- **FPS display** and debug features
- **Visual feedback** with vibration patterns

### 🏆 Offline Features
- **Complete offline gameplay** - no internet required
- **Local high score storage** using AsyncStorage
- **Persistent settings** and preferences
- **Background state handling** for mobile multitasking

## Advanced Build Options

### Production Build (App Store Ready)
```bash
eas build -p android --profile production
```
Creates AAB file for Google Play Store submission.

### iOS Build (requires Apple Developer Account)
```bash
eas build -p ios --profile preview  # For testing
eas build -p ios --profile production  # For App Store
```

## Performance Optimizations
- **RequestAnimationFrame** for smooth 60fps
- **Efficient collision detection** with optimized distance calculations
- **Smart spawning system** that scales with device performance
- **Memory management** for collectibles and obstacles
- **Hardware acceleration** with proper transform properties

## Troubleshooting

### Build Fails
```bash
# Clear Expo cache
expo r -c

# Reinstall dependencies  
rm -rf node_modules
npm install
```

### APK Won't Install
1. Enable "Install Unknown Apps" for your browser/file manager
2. Check Android version compatibility (Android 5.0+)
3. Ensure sufficient storage space (50+ MB)

Your APK will be a completely standalone game that works offline with all the enhanced mobile features and the same cheat system as the web version!