/**
 * Cenários 03, 04: Cadastro e mensagens de erro.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import TabBar from '../pageobjects/TabBar.js';
import LoginPage from '../pageobjects/LoginPage.js';
import NativeAlert from '../pageobjects/NativeAlert.js';

const loginDataPath = path.join(process.cwd(), 'tests', 'data', 'login.json');
const loginData = JSON.parse(fs.readFileSync(loginDataPath, 'utf-8'));
const { signUp } = loginData;

describe('Cadastro', () => {
  beforeEach(async () => {
    await TabBar.waitForTabBarShown();
    await TabBar.openLogin();
    await LoginPage.waitForIsShown(true);
  });

  it('03 - Cadastro com dados válidos', async () => {
    await LoginPage.tapOnSignUpContainerButton();
    await LoginPage.submitSignUpForm(signUp.valid.email, signUp.valid.password);

    await NativeAlert.waitForIsShown();
    const alertText = await NativeAlert.text();
    expect(alertText.toLowerCase()).toContain('signed up');

    await NativeAlert.tapOnButtonWithText('OK');
    await NativeAlert.waitForIsShown(false);
  });

  it('04 - Cadastro com confirmação de senha diferente e verificação de mensagem de erro', async () => {
    await LoginPage.tapOnSignUpContainerButton();
    const { email, password, confirmPassword } = signUp.passwordMismatch;
    await LoginPage.submitSignUpForm(email, password, confirmPassword);

    await LoginPage.waitForValidationFeedback();

    const hasError = await LoginPage.isAnyValidationErrorDisplayed();
    expect(hasError).toBe(true);

    await NativeAlert.waitForIsShown(false);
  });
});
