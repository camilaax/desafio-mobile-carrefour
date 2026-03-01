/**
 * Cenários 05, 06: Navegação entre telas.
 */
import TabBar from '../pageobjects/TabBar.js';
import HomePage from '../pageobjects/HomePage.js';
import FormsPage from '../pageobjects/FormsPage.js';

describe('Navegação', () => {
  beforeEach(async () => {
    await TabBar.waitForTabBarShown();
  });

  it('05 - Navegação entre tabs (Home, WebView, Login, Forms, Swipe, Drag)', async () => {
    await TabBar.openHome();
    await HomePage.waitForIsShown(true);

    await TabBar.openWebView();
    await driver.pause(500);

    await TabBar.openLogin();
    await driver.pause(500);

    await TabBar.openForms();
    await FormsPage.waitForIsShown(true);

    await TabBar.openSwipe();
    await driver.pause(500);

    await TabBar.openDrag();
    await driver.pause(500);

    await TabBar.openHome();
    await HomePage.waitForIsShown(true);
  });

  it('06 - Acesso à tela Forms via tab bar', async () => {
    await TabBar.openForms();
    await FormsPage.waitForIsShown(true);

    const isFormsVisible = await FormsPage.screen.isDisplayed();
    expect(isFormsVisible).toBe(true);
  });
});
