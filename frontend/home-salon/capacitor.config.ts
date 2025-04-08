import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'home-salon',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true
  },
  android: {
    webContentsDebuggingEnabled: true,
    loggingBehavior: 'debug'
  }

};

export default config;
