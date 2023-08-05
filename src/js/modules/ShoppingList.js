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
      databaseURL: import.meta.env.FIREBASE_DATABASE_URL,
    };
    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.firebaseDatabase = getDatabase(this.firebaseApp);
    this.firebaseShoppingListRef = ref(this.firebaseDatabase, 'shoppingList');

    this.bindMethods();
    this.addEventListeners();
  }

  // Methods to Create
  static createShoppingListElement(value, key) {
    const listItem = document.createElement('li');

    listItem.classList.add('add-to-cart__item');
    listItem.id = key;
    listItem.textContent = value;

    return listItem;
  }

  createElementForEmptyList() {
    let emptyElement = document.querySelector('.add-to-cart__empty-list');

    if (!emptyElement) {
      emptyElement = document.createElement('span');
      emptyElement.classList.add('add-to-cart__empty-list');
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
    this.inputFieldElement.style.border = 'initial';
  }

  deleteItemsFromShoppingList(event) {
    event.preventDefault();

    if (event.target && event.target.nodeName === 'li') {
      const locationOfItemInDB = ref(
        this.firebaseDatabase,
        `shoppingList/${event.target.id}`,
      );

      remove(locationOfItemInDB);
    }
  }

  // Methods to Render List
  addItemsToShoppingList(event) {
    event.preventDefault();

    const inputValue = this.inputFieldElement.value.trim();

    if (inputValue === '') {
      this.clearErrorMessageElement();
      this.errorMessageElement.style.display = 'block';
      this.errorMessageElement.textContent = 'Please enter a product.';
      this.inputFieldElement.style.border = '0.2rem solid var(--primary)';
      return;
    }

    this.clearErrorMessageElement();
    push(this.firebaseShoppingListRef, inputValue);
    this.clearInputFieldElement();
  }

  renderShoppingList() {
    onValue(this.firebaseShoppingListRef, (snapshot) => {
      if (snapshot.exists()) {
        const snapshotData = snapshot.val();
        const emptyElement = document.querySelector('.add-to-cart__empty-list');

        if (emptyElement) this.shoppingListElement.style.display = 'none';
        this.shoppingListElement.innerHTML = '';
        this.shoppingListElement.style.display = 'flex';

        const itemsArray = Object.entries(snapshotData);

        for (let i = 0; i < itemsArray.length; i += 1) {
          const [key, value] = itemsArray[i];
          const newListItem = ShoppingList.createShoppingListElement(
            value,
            key,
          );

          this.shoppingListElement.appendChild(newListItem);
        }
      } else this.createElementForEmptyList();
    });
  }

  // Events and Bindings
  bindMethods() {
    this.addItemsToShoppingList = this.addItemsToShoppingList.bind(this);
    this.clearErrorMessageElement = this.clearErrorMessageElement.bind(this);
    this.deleteItemsFromShoppingList =
      this.deleteItemsFromShoppingList.bind(this);
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
    this.shoppingListElement.addEventListener(
      'click',
      this.deleteItemsFromShoppingList,
    );
  }
}

export default ShoppingList;
