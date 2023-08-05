// eslint-disable-next-line import/no-extraneous-dependencies
import 'the-new-css-reset/css/reset.css';
import '../styles/style.css';

import App from './modules/App';
import ShoppingList from './modules/ShoppingList';

const myApp = new App('app');
myApp.render();

// eslint-disable-next-line no-new
new ShoppingList();
