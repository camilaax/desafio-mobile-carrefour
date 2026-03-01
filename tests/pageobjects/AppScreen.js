/**
 * Classe base para Page Objects.
 */
export default class AppScreen {
  constructor(selector) {
    this.selector = selector;
  }

  async waitForIsShown(isShown = true) {
    await $(this.selector).waitForDisplayed({
      reverse: !isShown,
    });
  }
}
