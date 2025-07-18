import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.agilmove.uca',
  appName: 'União, Comprometimento, Ação',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  ios: {
    icon: 'public/app-icon.png'
  },
  plugins: {
    App: {
      launchShowDuration: 0
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff'
    }
  },
  android: {
    icon: 'public/app-icon.png',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: 'AgilMoveUCA',
    backgroundColor: '#ffffff',
    overrideUserAgent: undefined,
    appendUserAgent: undefined
  }
};

export default config;
