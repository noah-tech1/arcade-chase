import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// APK download route
router.get('/arcade-collector.apk', (req, res) => {
  const apkPath = path.join(__dirname, '../public/arcade-collector.apk');
  
  // Check if APK file exists
  if (fs.existsSync(apkPath)) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="arcade-collector.apk"');
    res.download(apkPath, 'arcade-collector.apk');
  } else {
    // If APK doesn't exist, serve a message explaining how to build it
    res.status(404).json({
      error: 'APK not found',
      message: 'To generate the APK file, run: npm run build:mobile-apk',
      buildInstructions: [
        '1. Navigate to the mobile-app directory',
        '2. Run: eas build --platform android --local',
        '3. Copy the generated APK to server/public/'
      ]
    });
  }
});

export default router;