/**
 * Configuração compartilhada com Appium local.
 */
import { config as baseConfig } from './wdio.shared.conf.js';

export const config = {
  ...baseConfig,
  services: [
    ...(baseConfig.services || []),
    [
      'appium',
      {
        args: {
          relaxedSecurity: true,
          log: './logs/appium.log',
        },
      },
    ],
  ],
  before: async function (capabilities, specs) {
    if (typeof baseConfig.before === 'function') {
      await baseConfig.before(capabilities, specs);
    }
    if (driver.isAndroid) {
      await driver.updateSettings({
        waitForSelectorTimeout: 3 * 1000,
      });
    }
  },
};
