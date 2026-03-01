/**
 * Componente TabBar para navegação entre tabs.
 */
export default class TabBar {
  static async openHome() {
    await $('~Home').click();
  }

  static async openWebView() {
    await $('~Webview').click();
  }

  static async openLogin() {
    await $('~Login').click();
  }

  static async openForms() {
    await $('~Forms').click();
  }

  static async openSwipe() {
    await $('~Swipe').click();
  }

  static async openDrag() {
    await $('~Drag').click();
  }

  static async waitForTabBarShown() {
    const timeout = 10000;
    const tabs = ['~Home', '~Login', '~Forms'];
    try {
      await $('~Home').waitForDisplayed({ timeout });
      return;
    } catch (e) {
      try {
        if (driver.isAndroid) {
          await driver.back();
        } else {
          const ok = await $('~OK');
          if (await ok.isExisting()) await ok.click();
        }
        await $('~Home').waitForDisplayed({ timeout: 5000 });
        return;
      } catch {
        for (const tab of tabs) {
          try {
            await $(tab).waitForDisplayed({ timeout: 2000 });
            return;
          } catch {
            // next tab
          }
        }
        throw e;
      }
    }
  }
}
