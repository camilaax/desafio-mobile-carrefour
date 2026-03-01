/**
 * Configuração compartilhada do WebdriverIO.
 * Base para Android e iOS.
 */

export const config = {
  specs: [],
  logLevel: 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: 45000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [],
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'reports/allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 3 * 60 * 1000,
  },
  afterTest: async function (test, context, { passed }) {
    if (!passed) {
      try {
        const screenshot = await driver.takeScreenshot();
        const buffer = Buffer.from(screenshot, 'base64');
        const allure = (await import('@wdio/allure-reporter')).default;
        allure.addAttachment('Screenshot da falha', buffer, 'image/png');
      } catch (e) {
        console.warn('Falha ao capturar screenshot:', e?.message ?? e);
      }
    }
  },
};
