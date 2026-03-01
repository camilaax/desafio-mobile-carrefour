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
    try {
      const screenshot = await driver.takeScreenshot();
      const buffer = Buffer.from(screenshot, 'base64');
      const fs = await import('node:fs');
      const path = await import('node:path');
      const dir = path.join(process.cwd(), 'reports', 'screenshots');
      fs.mkdirSync(dir, { recursive: true });
      const safeName = (context.title || 'test').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 50);
      const status = passed ? 'passed' : 'failed';
      const filename = `${safeName}-${status}-${Date.now()}.png`;
      const filepath = path.join(dir, filename);
      fs.writeFileSync(filepath, buffer);

      const allure = (await import('@wdio/allure-reporter')).default;
      const label = passed ? 'Screenshot (final)' : 'Screenshot da falha';
      allure.addAttachment(label, buffer, 'image/png');
    } catch (e) {
      console.warn('Falha ao capturar screenshot:', e?.message ?? e);
    }
  },
};
