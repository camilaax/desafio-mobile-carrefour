/**
 * Cenários 03, 04: Cadastro e mensagens de erro.
 */
import TabBar from '../pageobjects/TabBar.js';
import LoginPage from '../pageobjects/LoginPage.js';
import NativeAlert from '../pageobjects/NativeAlert.js';

describe('Cadastro', () => {
  beforeEach(async () => {
    await TabBar.waitForTabBarShown();
    await TabBar.openLogin();
    await LoginPage.waitForIsShown(true);
  });

  it('03 - Cadastro com dados válidos', async () => {
    await LoginPage.tapOnSignUpContainerButton();
    await driver.pause(500);
    await LoginPage.submitSignUpForm('novo@teste.com', 'Senha1234!');

    await NativeAlert.waitForIsShown();
    const alertText = await NativeAlert.text();
    expect(alertText.toLowerCase()).toContain('signed up');

    await NativeAlert.tapOnButtonWithText('OK');
    await NativeAlert.waitForIsShown(false);
  });

  it('04 - Cadastro com confirmação de senha diferente e verificação de mensagem de erro', async () => {
    await LoginPage.tapOnSignUpContainerButton();
    await LoginPage.submitSignUpForm('teste@email.com', 'Senha1234!', 'SenhaDiferente');

    await driver.pause(1500);

    const hasError = await LoginPage.isAnyValidationErrorDisplayed();
    expect(hasError).toBe(true);

    await NativeAlert.waitForIsShown(false);
  });
});
