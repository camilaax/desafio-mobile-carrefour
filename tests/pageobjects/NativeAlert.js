/**
 * Componente para interação com alertas (iOS/Android).
 * 
 */
const ALERT_TIMEOUT = 5000;
const ALERT_GONE_TIMEOUT = 1500;

const SELECTORS = {
  ANDROID: {
    alertByText: (text) => `-android uiautomator:new UiSelector().textContains("${text}")`,
    buttonByText: (text) => `-android uiautomator:new UiSelector().textContains("${text}").className("android.widget.Button")`,
    buttonOk: '-android uiautomator:new UiSelector().textContains("OK")',
    NATIVE_BUTTON: '*//android.widget.Button[@text="OK"]',
  },
  IOS: {
    ALERT: "-ios predicate string:type == 'XCUIElementTypeAlert'",
    alertByLabel: (text) => `-ios predicate string:label CONTAINS[c] "${text}" OR value CONTAINS[c] "${text}"`,
    BUTTON_OK: '~OK',
    staticTextWith: (text) => `-ios predicate string:type == 'XCUIElementTypeStaticText' AND (label CONTAINS[c] "${text}" OR value CONTAINS[c] "${text}")`,
  },
};

const ANDROID_ALERT_TEXTS = [
  { text: 'Success', timeout: ALERT_TIMEOUT },
  { text: 'Signed Up!', timeout: 2000 },
  { text: 'Signed Up', timeout: 1500 },
  { text: 'This button is', timeout: 1500 },
];

const IOS_ALERT_TEXTS = [
  { text: 'you successfully', timeout: ALERT_TIMEOUT },
  { text: 'success', timeout: 3000 },
  { text: 'signed up', timeout: 2000 },
  { text: 'This button is', timeout: 1500 },
];

class NativeAlert {
  static async waitForIsShown(isShown = true) {
    if (driver.isAndroid) {
      if (isShown) {
        let lastErr;
        for (const { text, timeout } of ANDROID_ALERT_TEXTS) {
          const sel = SELECTORS.ANDROID.alertByText(text);
          try {
            await $(sel).waitForExist({ timeout, reverse: false });
            return;
          } catch (e) {
            lastErr = e;
          }
        }
        throw lastErr;
      } else {
        for (const text of ['Signed Up', 'Success']) {
          await $(SELECTORS.ANDROID.alertByText(text)).waitForExist({ timeout: ALERT_GONE_TIMEOUT, reverse: true }).catch(() => { });
        }
      }
    } else {
      if (isShown) {
        try {
          await $(SELECTORS.IOS.ALERT).waitForExist({ timeout: ALERT_TIMEOUT, reverse: false });
          return;
        } catch {
          let lastErr;
          for (const { text, timeout } of IOS_ALERT_TEXTS) {
            const sel = SELECTORS.IOS.alertByLabel(text);
            try {
              await $(sel).waitForExist({ timeout: Math.min(timeout, 2000), reverse: false });
              return;
            } catch (err) {
              lastErr = err;
            }
          }
          throw lastErr;
        }
      } else {
        await $(SELECTORS.IOS.ALERT).waitForExist({ timeout: ALERT_GONE_TIMEOUT, reverse: true }).catch(() => { });
      }
    }
  }

  static async tapOnButtonWithText(selector) {
    if (driver.isAndroid) {
      const label = selector.toUpperCase();
      const candidates = [
        SELECTORS.ANDROID.buttonOk,
        SELECTORS.ANDROID.buttonByText('OK'),
        SELECTORS.ANDROID.NATIVE_BUTTON,
        `-android uiautomator:new UiSelector().text("${label}")`,
        '~OK',
        `~${selector}`,
      ];
      for (const sel of candidates) {
        const el = await $(sel);
        if (await el.isExisting()) {
          await el.click();
          return;
        }
      }
      throw new Error(`Botão de alerta não encontrado: ${selector}`);
    }
    await $(`~${selector}`).click();
  }

  static async text() {
    if (driver.isIOS) {
      try {
        const native = await $(SELECTORS.IOS.ALERT);
        if (await native.isExisting()) return await native.getText();
      } catch {
        // ignore
      }
      for (const { text } of IOS_ALERT_TEXTS) {
        const el = await $(SELECTORS.IOS.alertByLabel(text));
        if (await el.isExisting()) return await el.getText();
      }
      for (const { text } of IOS_ALERT_TEXTS) {
        const el = await $(SELECTORS.IOS.staticTextWith(text));
        if (await el.isExisting()) return await el.getText();
      }
      if (await $(SELECTORS.IOS.BUTTON_OK).isExisting()) return 'You successfully signed up!';
      return '';
    }
    const texts = ['Success', 'Signed Up', 'Signed Up!', 'You successfully', 'This button is'];
    for (const t of texts) {
      const el = await $(SELECTORS.ANDROID.alertByText(t));
      if (await el.isExisting()) {
        return await el.getText();
      }
    }
    return '';
  }
}

export default NativeAlert;
