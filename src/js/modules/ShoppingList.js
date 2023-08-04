import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';

class ShoppingList {
  constructor() {
    this.inputFieldElement = document.querySelector('#input-field');
    this.addButtonElement = document.querySelector('#add-button');
    this.errorMessageElement = document.querySelector('#error-message');
    this.shoppingListElement = document.querySelector('#shopping-list');

    this.firebaseConfig = {
      databaseURL:
        'https://shopping-cart-list-f1b57-default-rtdb.firebaseio.com/',
    };

    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.firebaseDatabase = getDatabase(this.firebaseApp);
    this.firebaseShoppingListRef = ref(this.firebaseDatabase, 'shoppingList');
  }
  // Methods to Create
  createShoppingListElement(value, key) {
    let listItem = document.createElement('li');

    listItem.classList.add('add-to-card__item');
    listItem.id = key;
    listItem.textContent = value;

    return listItem;
  }

  createElementForEmptyList() {
    let emptyElement = document.querySelector('.add-to-card__empty-list');

    if (!emptyElement) {
      emptyElement = document.createElement('span');
      emptyElement.classList.add('add-to-card__empty-list');
      emptyElement.textContent = 'Your shopping list is empty';

      this.shoppingListElement.appendChild(emptyElement);
      this.shoppingListElement.style.display = 'none';
    }
  }

  // Methods to Clear/Delete
  clearInputFieldElement() {
    this.inputFieldElement.value = '';
  }

  clearShoppingListElement() {
    this.shoppingListElement.innerHTML = '';
  }

  // Methods to Render List

  // Events
  addEventListeners() {}
}

export default ShoppingList;
