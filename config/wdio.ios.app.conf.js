/**
 * Configuração para execução no iOS.
 */
import { join } from 'node:path';
import { config as baseConfig } from './wdio.shared.local.appium.conf.js';

export const config = {
  ...baseConfig,
  specs: ['../tests/specs/**/*.spec.js'],
  maxWorkers: 1,
  connectionRetryTimeout: 300000,
  connectionRetryCount: 4,
  capabilities: [
    {
      platformName: 'iOS',
      'wdio:maxInstances': 1,
      'appium:deviceName': process.env.IOS_DEVICE || 'iPhone 15',
      'appium:platformVersion': process.env.IOS_VERSION || '17.2',
      'appium:orientation': 'PORTRAIT',
      'appium:automationName': 'XCUITest',
      'appium:app': join(
        process.cwd(),
        'apps',
        process.env.IOS_APP || 'ios.simulator.wdio.native.app.v2.0.0.zip'
      ),
      'appium:newCommandTimeout': 240,
      'appium:webviewConnectTimeout': 20 * 1000,
      'appium:maxTypingFrequency': 30,
      'appium:wdaLaunchTimeout': 180000,
      'appium:wdaStartupRetries': 4,
      'appium:wdaStartupRetryInterval': 30000,
    },
  ],
};
