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
  before: async function (capabilities) {
    const allure = (await import('@wdio/allure-reporter')).default;
    const platform = capabilities.platformName || (driver.isAndroid ? 'Android' : 'iOS');
    const device = capabilities['appium:deviceName'] || 'Unknown';
    const version = capabilities['appium:platformVersion'] || '';
    allure.addEnvironment('Mobile.Platform', platform);
    allure.addEnvironment('Device', device);
    if (version) allure.addEnvironment('Platform.Version', version);
  },

  onComplete: async function () {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const dir = path.join(process.cwd(), 'reports', 'allure-results');
    fs.mkdirSync(dir, { recursive: true });

    const props = [
      `OS=${process.platform}`,
      `Node=${process.version}`,
      `Framework=WebdriverIO`,
      `Library=Appium`,
      `TestRunner=Mocha`,
    ].join('\n');
    fs.writeFileSync(path.join(dir, 'environment.properties'), props);

    const logPath = path.join(process.cwd(), 'logs', 'appium.log');
    if (fs.existsSync(logPath)) {
      const log = fs.readFileSync(logPath, 'utf-8');
      const maxSize = 512 * 1024;
      const trimmed = log.length > maxSize ? log.slice(-maxSize) : log;
      fs.writeFileSync(
        path.join(dir, 'appium-log-attachment.txt'),
        trimmed,
      );
    }
  },

  afterTest: async function (test, context, { passed }) {
    try {
      const screenshot = await driver.takeScreenshot();
      const buffer = Buffer.from(screenshot, 'base64');
      const fs = await import('node:fs');
      const path = await import('node:path');
      const dir = path.join(process.cwd(), 'reports', 'screenshots');
      fs.mkdirSync(dir, { recursive: true });

      const descricao = (test?.title || context?.title || 'teste').trim();
      const statusLabel = passed ? 'PASSOU' : 'FALHOU';
      const dataHora = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '-');
      const safeName = descricao.replace(/[/\\:*?"<>|]/g, '-').replace(/\s+/g, '-').slice(0, 50);
      const filename = `${safeName}-${statusLabel}-${dataHora}.png`;
      const filepath = path.join(dir, filename);
      fs.writeFileSync(filepath, buffer);

      const allure = (await import('@wdio/allure-reporter')).default;
      const label = `[${statusLabel}] ${descricao}`;
      allure.addAttachment(label, buffer, 'image/png');
    } catch (e) {
      console.warn('Falha ao capturar screenshot:', e?.message ?? e);
    }
  },
};
