/**
 * Configuração para execução no Android.
 */
import { join } from 'node:path';
import { config as baseConfig } from './wdio.shared.local.appium.conf.js';

export const config = {
  ...baseConfig,
  specs: ['../tests/specs/**/*.spec.js'],
  capabilities: [
    {
      platformName: 'Android',
      'wdio:maxInstances': 1,
      'appium:deviceName': process.env.ANDROID_DEVICE || 'emulator-5554',
      'appium:platformVersion': process.env.ANDROID_VERSION || '13.0',
      'appium:orientation': 'PORTRAIT',
      'appium:automationName': 'UiAutomator2',
      'appium:app': join(
        process.cwd(),
        'apps',
        process.env.ANDROID_APP || 'android.wdio.native.app.v2.0.0.apk'
      ),
      'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity',
      'appium:newCommandTimeout': 240,
    },
  ],
};
