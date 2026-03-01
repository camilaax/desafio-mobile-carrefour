/**
 * Cenários 05, 06: Navegação entre telas.
 */
import { expect } from 'chai';
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

    await TabBar.openLogin();

    await TabBar.openForms();
    await FormsPage.waitForIsShown(true);

    await TabBar.openSwipe();

    await TabBar.openDrag();

    await TabBar.openHome();
    await HomePage.waitForIsShown(true);
  });

  it('06 - Acesso à tela Forms via tab bar', async () => {
    await TabBar.openForms();
    await FormsPage.waitForIsShown(true);

    const isFormsVisible = await FormsPage.isDisplayed();
    expect(isFormsVisible).to.be.true;
  });
});
