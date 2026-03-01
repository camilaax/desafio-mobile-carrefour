/**
 * Cenários 01, 02, 10: Login e mensagens de erro.
 */
import { expect } from 'chai';
import TabBar from '../pageobjects/TabBar.js';
import LoginPage from '../pageobjects/LoginPage.js';
import NativeAlert from '../pageobjects/NativeAlert.js';

describe('Login e Cadastro', () => {
  beforeEach(async () => {
    await TabBar.waitForTabBarShown();
    await TabBar.openLogin();
    await LoginPage.waitForIsShown(true);
  });

  it('01 - Login com credenciais válidas', async () => {
    await LoginPage.tapOnLoginContainerButton();
    await LoginPage.submitLoginForm('test@webdriver.io', 'Test1234!');

    await NativeAlert.waitForIsShown();
    const alertText = await NativeAlert.text();
    expect(alertText).to.include('Success');

    await NativeAlert.tapOnButtonWithText('OK');
    await NativeAlert.waitForIsShown(false);
  });

  it('02 - Login com credenciais inválidas e verificação de mensagem de erro', async () => {
    await LoginPage.tapOnLoginContainerButton();
    await LoginPage.submitLoginForm('invalid-email', '123');

    await LoginPage.waitForValidationFeedback();

    const hasError = await LoginPage.isAnyValidationErrorDisplayed();
    expect(hasError).to.be.true;

    await NativeAlert.waitForIsShown(false);
  });

  it('10 - Verificação de mensagem de erro em login com campos vazios', async () => {
    await LoginPage.tapOnLoginContainerButton();
    await LoginPage.submitLoginFormEmpty();

    await LoginPage.waitForValidationFeedback();

    const hasError = await LoginPage.isAnyValidationErrorDisplayed();
    expect(hasError).to.be.true;

    await NativeAlert.waitForIsShown(false);
  });
});
