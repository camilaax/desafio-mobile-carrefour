/**
 * Page Object para a tela de Login/Cadastro.
 */
import AppScreen from './AppScreen.js';

const SELECTORS = {
  SCREEN: '~Login-screen',
};

class LoginPage extends AppScreen {
  constructor() {
    super(SELECTORS.SCREEN);
  }

  get screen() {
    return $(SELECTORS.SCREEN);
  }

  get loginContainerButton() {
    return $('~button-login-container');
  }

  get signUpContainerButton() {
    return $('~button-sign-up-container');
  }

  get loginButton() {
    return $('~button-LOGIN');
  }

  get signUpButton() {
    return $('~button-SIGN UP');
  }

  get email() {
    return $('~input-email');
  }

  get password() {
    return $('~input-password');
  }

  get repeatPassword() {
    return $('~input-repeat-password');
  }

  async tapOnLoginContainerButton() {
    await this.loginContainerButton.click();
  }

  async tapOnSignUpContainerButton() {
    await this.signUpContainerButton.click();
  }

  async submitLoginForm(username, password) {
    await this.email.setValue(username);
    await this.password.setValue(password);

    if (driver.isIOS) {
      try { await driver.hideKeyboard(); } catch (e) { console.warn('Teclado já fechado ou indisponível:', e?.message ?? e); }
      await driver.pause(300);
    } else if (await driver.isKeyboardShown()) {
      await $('~Login-screen').click();
    }

    await this.loginButton.scrollIntoView({
      scrollableElement: await this.screen,
    });
    await this.loginButton.click();
  }

  async submitSignUpForm(username, password, repeatPassword) {
    await this.email.setValue(username);
    await this.password.setValue(password);

    const rpField = await this.repeatPassword;
    await rpField.waitForExist({ timeout: 5000 });
    await rpField.setValue(repeatPassword ?? password);

    if (driver.isIOS) {
      try { await driver.hideKeyboard(); } catch (e) { console.warn('Teclado já fechado ou indisponível:', e?.message ?? e); }
      await driver.pause(300);
    } else if (await driver.isKeyboardShown()) {
      await $('~Login-screen').click();
    }

    await this.signUpButton.scrollIntoView({
      scrollableElement: await this.screen,
    });
    await driver.pause(300);
    await this.signUpButton.click();
  }

  async submitLoginFormEmpty() {
    await this.loginButton.scrollIntoView({
      scrollableElement: await this.screen,
    });
    await this.loginButton.click();
  }

  async isEmailErrorDisplayed() {
    try {
      const selector = driver.isAndroid
        ? '//*[contains(@text, "valid email") or contains(@content-desc, "valid email")]'
        : '-ios predicate string:label CONTAINS "valid email"';
      const el = await $(selector);
      return await el.isDisplayed();
    } catch (e) {
      console.warn('Elemento de erro de email não encontrado:', e?.message ?? e);
      return false;
    }
  }

  async isPasswordErrorDisplayed() {
    try {
      const selector = driver.isAndroid
        ? '//*[contains(@text, "8 characters") or contains(@text, "at least 8") or contains(@content-desc, "8 characters")]'
        : '-ios predicate string:label CONTAINS "8 characters"';
      const el = await $(selector);
      return await el.isDisplayed();
    } catch (e) {
      console.warn('Elemento de erro de senha não encontrado:', e?.message ?? e);
      return false;
    }
  }

  async isConfirmationErrorDisplayed() {
    try {
      const selector = driver.isAndroid
        ? '//*[contains(@text, "same password") or contains(@content-desc, "same password")]'
        : '-ios predicate string:label CONTAINS "same password"';
      const el = await $(selector);
      return await el.isDisplayed();
    } catch (e) {
      console.warn('Elemento de erro de confirmação não encontrado:', e?.message ?? e);
      return false;
    }
  }

  async isAnyValidationErrorDisplayed() {
    const hasEmailError = await this.isEmailErrorDisplayed();
    const hasPasswordError = await this.isPasswordErrorDisplayed();
    const hasConfirmationError = await this.isConfirmationErrorDisplayed();
    return hasEmailError || hasPasswordError || hasConfirmationError;
  }
}

export default new LoginPage();
