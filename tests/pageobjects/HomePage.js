/**
 * Page Object para a tela Home.
 */
import AppScreen from './AppScreen.js';

class HomePage extends AppScreen {
  constructor() {
    super('~Home-screen');
  }
}

export default new HomePage();
