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

    // Firebase Properties
    this.firebaseConfig = {
      databaseURL:
        'https://shopping-cart-list-f1b57-default-rtdb.firebaseio.com/',
    };
    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.firebaseDatabase = getDatabase(this.firebaseApp);
    this.firebaseShoppingListRef = ref(this.firebaseDatabase, 'shoppingList');

    this.bindMethods();
    this.addEventListeners();
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

    this.clearShoppingListElement();
  }

  // Methods to Clear/Delete
  clearInputFieldElement() {
    this.inputFieldElement.value = '';
  }

  clearShoppingListElement() {
    this.shoppingListElement.innerHTML = '';
  }

  clearErrorMessageElement() {
    this.errorMessageElement.textContent = '';
    this.errorMessageElement.style.display = 'none';
  }

  deleteItemsFromShoppingList(event) {
    event.preventDefault();

    if (event.target && event.target.nodeName === 'li') {
      let locationOfItemInDB = ref(
        this.firebaseDatabase,
        `shoppingList/${event.target.id}`,
      );

      remove(locationOfItemInDB);
    }
  }

  // Methods to Render List
  addItemsToShoppingList(event) {
    event.preventDefault();

    let inputValue = this.inputFieldEl.value.trim();

    if (inputValue === '') {
      this.clearErrorMessageElement();
      this.errorMessageElement.style.display = 'block';
      this.errorMessageElement.textContent = 'Please enter a value';
      return;
    }

    this.clearErrorMessageElement();
    push(this.firebaseShoppingListRef, inputValue);
    this.clearInputFieldElement();
  }

  // Events and Bindings
  bindMethods() {
    this.clearErrorMessageElement = this.clearErrorMessageElement.bind(this);
  }

  addEventListeners() {
    this.addButtonElement.addEventListener(
      'click',
      this.addItemsToShoppingList,
    );
    this.inputFieldElement.addEventListener(
      'input',
      this.clearErrorMessageElement,
    );
  }
}

export default ShoppingList;
