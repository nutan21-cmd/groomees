import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Groomees',
  webDir: 'www',
  server: {
    androidScheme: 'http',
  }
};

export default config;
