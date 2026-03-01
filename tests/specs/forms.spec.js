/**
 * Cenários 07, 08, 09: Formulários e validações.
 */
import TabBar from '../pageobjects/TabBar.js';
import FormsPage from '../pageobjects/FormsPage.js';
import Picker from '../pageobjects/Picker.js';
import NativeAlert from '../pageobjects/NativeAlert.js';

describe('Formulários', () => {
  beforeEach(async () => {
    await TabBar.waitForTabBarShown();
    await TabBar.openForms();
    await FormsPage.waitForIsShown(true);
  });

  it('07 - Preenchimento do formulário com input, switch e dropdown', async () => {
    const text = 'Texto de teste';
    await FormsPage.input.setValue(text);
    await driver.pause(400);
    const textDisplayed = await FormsPage.verifyInputTextDisplayed(text);
    expect(textDisplayed).toBe(true);

    expect(await FormsPage.isSwitchActive()).toBe(false);
    await FormsPage.tapOnSwitch();
    expect(await FormsPage.isSwitchActive()).toBe(true);

    await FormsPage.tapOnDropDown();
    await Picker.selectValue('This app is awesome');
    expect(await FormsPage.getDropDownText()).toContain('This app is awesome');

    if (await driver.isKeyboardShown()) {
      await FormsPage.tapOnInputTextResult();
    }
  });

  it('08 - Validação de campo obrigatório (botão inativo não dispara alerta)', async () => {
    await NativeAlert.waitForIsShown(false);

    await FormsPage.tapOnInActiveButton();
    await driver.pause(1000);

    await NativeAlert.waitForIsShown(false);
  });

  it('09 - Submissão do formulário e verificação de feedback (botão ativo)', async () => {
    await FormsPage.tapOnActiveButton();

    await NativeAlert.waitForIsShown();
    const alertText = await NativeAlert.text();
    expect(alertText).toContain('This button is');

    await NativeAlert.tapOnButtonWithText('OK');
    await NativeAlert.waitForIsShown(false);
  });
});
