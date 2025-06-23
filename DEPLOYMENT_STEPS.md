# Mobile App Deployment Guide

## Step 1: Install Expo CLI
```bash
npm install -g @expo/cli
```

## Step 2: Create Expo Account
1. Go to https://expo.dev and sign up
2. Verify your email address

## Step 3: Test Your App
```bash
cd mobile-app-simple
npm install
npm start
```

## Step 4: Build for App Stores

### Install EAS CLI
```bash
npm install -g eas-cli
```

### Login to Expo
```bash
eas login
```

### Configure Build
```bash
eas build:configure
```

### Build for Android
```bash
eas build --platform android
```

### Build for iOS (requires Apple Developer Account)
```bash
eas build --platform ios
```

## Step 5: App Store Submission

### Google Play Store
1. Create Google Play Developer account ($25 one-time fee)
2. Download your Android build (APK/AAB)
3. Upload to Google Play Console
4. Fill out app details and screenshots
5. Submit for review

### Apple App Store
1. Create Apple Developer account ($99/year)
2. Download your iOS build (IPA)
3. Upload via App Store Connect
4. Fill out app details and screenshots
5. Submit for review

## App Store Requirements

### Screenshots Needed
- Phone screenshots (multiple sizes)
- Tablet screenshots (for iPad support)
- Feature graphic for Google Play

### App Description Template
```
Experience the classic arcade action of Arcade Collector! 

🎮 FEATURES:
- Simple touch controls - drag to move
- Collect blue items to increase your score
- Avoid red obstacles to survive
- Multiple lives system
- Special cheat codes for advanced players

🕹️ GAMEPLAY:
Navigate your character through an endless stream of collectibles and obstacles. How high can you score?

Perfect for quick gaming sessions or extended play. Classic arcade fun optimized for mobile devices.
```

### Keywords for App Stores
- arcade game
- collector
- retro gaming
- mobile game
- casual game
- high score
- obstacle avoidance

## Monetization Options (Optional)
- In-app purchases for extra lives
- Remove ads upgrade
- Premium cheat codes
- Character skins
- Ad integration (banner/interstitial ads)

The mobile version preserves all core gameplay while being optimized for touch controls and mobile performance.