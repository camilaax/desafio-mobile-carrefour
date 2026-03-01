/**
 * Componente TabBar para navegação entre tabs.
 */
export default class TabBar {
  static async openHome() {
    await $('~Home').click();
  }

  static async openWebView() {
    await $('~Webview').click();
    await driver.pause(500);
  }

  static async openLogin() {
    await $('~Login').click();
    await driver.pause(500);
  }

  static async openForms() {
    await $('~Forms').click();
  }

  static async openSwipe() {
    await $('~Swipe').click();
    await driver.pause(500);
  }

  static async openDrag() {
    await $('~Drag').click();
    await driver.pause(500);
  }

  static async waitForTabBarShown() {
    const timeout = 20000;
    const tabs = ['~Home', '~Login', '~Forms'];
    try {
      await $('~Home').waitForDisplayed({ timeout });
      return;
    } catch (e) {
      // Recuperação: dismissar alerta/dialog e tentar de novo (Android: back, iOS: tap OK)
      try {
        if (driver.isAndroid) {
          await driver.back();
          await driver.pause(800);
        } else {
          const ok = await $('~OK');
          if (await ok.isExisting()) await ok.click();
          await driver.pause(500);
        }
        await $('~Home').waitForDisplayed({ timeout: 8000 });
        return;
      } catch {
        for (const tab of tabs) {
          try {
            await $(tab).waitForDisplayed({ timeout: 3000 });
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
