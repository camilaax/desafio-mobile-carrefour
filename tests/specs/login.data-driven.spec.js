/**
 * Cenário data-driven: Login com dados do JSON.
 * Opcional - demonstra data-driven testing.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import TabBar from '../pageobjects/TabBar.js';
import LoginPage from '../pageobjects/LoginPage.js';
import NativeAlert from '../pageobjects/NativeAlert.js';

const loginDataPath = path.join(
  process.cwd(),
  'tests',
  'data',
  'login.json'
);
const loginData = JSON.parse(
  fs.readFileSync(loginDataPath, 'utf-8')
);
const loginCredentials = loginData.login;

describe('Login data-driven', () => {
  loginCredentials.forEach((data) => {
    it(`Login com ${data.description}`, async () => {
      await TabBar.waitForTabBarShown();
      await TabBar.openLogin();
      try {
        await LoginPage.waitForIsShown(true);
      } catch {
        await TabBar.openLogin();
        await LoginPage.waitForIsShown(true);
      }

      await LoginPage.tapOnLoginContainerButton();
      await LoginPage.submitLoginForm(data.username, data.password);

      await NativeAlert.waitForIsShown();
      const alertText = await NativeAlert.text();
      expect(alertText).toContain('Success');

      await NativeAlert.tapOnButtonWithText('OK');
      await NativeAlert.waitForIsShown(false);
    });
  });
});
