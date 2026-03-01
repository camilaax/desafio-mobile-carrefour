/**
 * Page Object para a tela de Formulários.
 */
import AppScreen from './AppScreen.js';

const SELECTORS = {
  SCREEN: '~Forms-screen',
};

class FormsPage extends AppScreen {
  constructor() {
    super(SELECTORS.SCREEN);
  }

  get screen() {
    return $(SELECTORS.SCREEN);
  }

  get input() {
    return $('~text-input');
  }

  get inputTextResult() {
    return $('~input-text-result');
  }

  async verifyInputTextDisplayed(expectedText) {
    try {
      const selector = driver.isAndroid
        ? `//*[contains(@text, "${expectedText}")]`
        : `-ios predicate string:label CONTAINS "${expectedText}"`;
      const el = await $(selector);
      return await el.isDisplayed();
    } catch {
      try {
        const resultText = await this.inputTextResult.getText();
        return resultText.includes(expectedText);
      } catch {
        return false;
      }
    }
  }

  get switch() {
    return $('~switch');
  }

  get switchText() {
    return $('~switch-text');
  }

  get dropDown() {
    return $('~Dropdown');
  }

  get dropDownChevron() {
    return $('~dropdown-chevron');
  }

  get activeButton() {
    return $('~button-Active');
  }

  get inActiveButton() {
    return $('~button-Inactive');
  }

  async tapOnInputTextResult() {
    await this.inputTextResult.click();
  }

  async tapOnSwitch() {
    await this.switch.click();
  }

  async tapOnDropDown() {
    if (driver.isIOS) {
      await this.dropDownChevron.click();
    } else {
      await this.dropDown.click();
    }
  }

  async tapOnActiveButton() {
    await this.activeButton.scrollIntoView({
      maxScrolls: 2,
      scrollableElement: await this.screen,
    });
    await this.activeButton.click();
  }

  async tapOnInActiveButton() {
    await this.inActiveButton.scrollIntoView({
      maxScrolls: 2,
      scrollableElement: await this.screen,
    });
    await this.inActiveButton.click();
  }

  async isSwitchActive() {
    return driver.isAndroid
      ? (await this.switch.getAttribute('checked')) === 'true'
      : (await this.switch.getText()) === '1';
  }

  async getDropDownText() {
    const selector = driver.isAndroid
      ? '//*[@content-desc="Dropdown"]//android.widget.EditText'
      : '-ios class chain:**/*[`name == "Dropdown"`]/**/*[`name == "text_input"`]';
    return $(selector).getText();
  }

  async fillForm(inputText, switchOn) {
    await this.input.setValue(inputText);
    const isActive = await this.isSwitchActive();
    if (switchOn !== isActive) {
      await this.tapOnSwitch();
    }
  }
}

export default new FormsPage();
