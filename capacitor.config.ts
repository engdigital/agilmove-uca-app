import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.agilmove.uca',
  appName: 'UCA - Pergaminhos',
  webDir: 'out',
  server: {
    androidScheme: 'https'
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
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: 'AgilMoveUCA',
    backgroundColor: '#ffffff'
  }
};

export default config;
