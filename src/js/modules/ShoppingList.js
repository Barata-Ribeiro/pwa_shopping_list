import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

class ShoppingList {
  constructor() {
    this.mainContainer = document.querySelector('.add-to-cart__container');
    this.loginButtonElement = document.querySelector('#login-button');
    this.logoutButtonElement = document.querySelector('#logout-button');
    this.inputFieldElement = document.querySelector('#input-field');
    this.addButtonElement = document.querySelector('#add-button');
    this.addButtonElement.disabled = true;
    this.errorMessageElement = document.querySelector('#error-message');
    this.shoppingListElement = document.querySelector('#shopping-list');

    this.spinner = ShoppingList.createLoadingSpinner();
    this.mainContainer.appendChild(this.spinner);

    this.modalContainer = document.querySelector('#error-modal-container');
    this.modalErrorMessage = document.querySelector('#modal-error-message');
    this.modalCloseButton = document.querySelector(
      '.error-modal__close-button',
    );

    // Firebase Properties
    this.firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.firebaseDatabase = getDatabase(this.firebaseApp);
    this.firebaseShoppingListRef = null;
    this.firebaseAuth = getAuth();
    this.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.firebaseShoppingListRef = ref(
          this.firebaseDatabase,
          `users/${this.userId}/shoppingList`,
        );
        this.renderShoppingList();
        this.addButtonElement.disabled = false;

        // Show logout button and hide login button
        this.logoutButtonElement.style.display = 'block';
        this.loginButtonElement.style.display = 'none';
      } else {
        this.clearShoppingListElement();
        this.addButtonElement.disabled = true;

        // Show login button and hide logout button
        this.logoutButtonElement.style.display = 'none';
        this.loginButtonElement.style.display = 'block';
      }
    });

    this.bindMethods();
    this.addEventListeners();
  }

  // Firebase Methods
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(this.firebaseAuth, provider);
      const { user } = result;

      this.userId = user.uid;
      this.firebaseShoppingListRef = ref(
        this.firebaseDatabase,
        `users/${this.userId}/shoppingList`,
      );

      // Wait for firebaseShoppingListRef to be defined before rendering
      Promise.resolve(this.firebaseShoppingListRef).then(() => {
        this.renderShoppingList();
      });
    } catch (error) {
      // Handle any errors that occurred during sign-in.
      this.displayErrorMessage(
        'Error during sign-in. Please try again later.',
        error,
      );
    }
  }

  async logout() {
    try {
      await this.firebaseAuth.signOut();
      const emptyElement = document.querySelector('.add-to-cart__empty-list');
      if (emptyElement) emptyElement.remove();
    } catch (error) {
      this.displayErrorMessage(
        'Error during sign-out. Please try again later.',
        error,
      );
    }
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
      emptyElement.textContent = 'Your shopping list is empty!';

      this.mainContainer.appendChild(emptyElement);
      this.shoppingListElement.style.display = 'none';
    }

    this.clearShoppingListElement();
  }

  displayErrorMessage(message, error) {
    const errorMessage = error
      ? `${message} Error details: ${error.message}`
      : message;
    this.modalErrorMessage.textContent = errorMessage;
    this.modalContainer.style.display = 'block';
  }

  static createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    spinner.innerHTML = '<div class="spinner"></div>';
    return spinner;
  }

  // Methods to Clear/Delete
  closeModal() {
    this.modalContainer.style.display = 'none';
  }

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
    if (event.target && event.target.nodeName === 'LI') {
      const locationOfItemInDB = ref(
        this.firebaseDatabase,
        `users/${this.userId}/shoppingList/${event.target.id}`,
      );

      remove(locationOfItemInDB).catch((error) => {
        this.displayErrorMessage(
          'Error removing item. Please try again later.',
          error,
        );
      });
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

    if (this.firebaseShoppingListRef) {
      push(this.firebaseShoppingListRef, inputValue).catch((error) => {
        this.displayErrorMessage(
          'Failed to add the item to the shopping list.',
          error,
        );
      });
      this.clearInputFieldElement();
    } else {
      this.displayErrorMessage('User not logged in.');
    }
  }

  renderShoppingList() {
    this.spinner.style.display = 'flex';

    if (this.firebaseShoppingListRef) {
      onValue(this.firebaseShoppingListRef, (snapshot) => {
        this.spinner.style.display = 'none';
        this.shoppingListElement.innerHTML = '';

        if (snapshot.exists()) {
          const snapshotData = snapshot.val();

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

          const emptyElement = document.querySelector(
            '.add-to-cart__empty-list',
          );
          if (emptyElement) emptyElement.remove();

          if (Object.keys(snapshotData).length >= 20) {
            this.addButtonElement.disabled = true;
            this.displayErrorMessage('You can only add up to 20 items.');
          } else {
            this.addButtonElement.disabled = false;
          }
        } else {
          this.shoppingListElement.style.display = 'none';
          this.createElementForEmptyList();
        }
      });
    } else {
      this.displayErrorMessage('firebaseShoppingListRef is not defined');
      this.spinner.style.display = 'none';
    }
  }

  // Events and Bindings
  bindMethods() {
    this.addItemsToShoppingList = this.addItemsToShoppingList.bind(this);
    this.clearErrorMessageElement = this.clearErrorMessageElement.bind(this);
    this.deleteItemsFromShoppingList =
      this.deleteItemsFromShoppingList.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.logout = this.logout.bind(this);

    this.closeModal = this.closeModal.bind(this);
    this.displayErrorMessage = this.displayErrorMessage.bind(this);
  }

  addEventListeners() {
    this.addButtonElement.disabled = true;
    this.addButtonElement.addEventListener(
      'click',
      this.addItemsToShoppingList,
    );
    this.inputFieldElement.addEventListener(
      'input',
      this.clearErrorMessageElement,
    );
    this.shoppingListElement.addEventListener(
      'dblclick',
      this.deleteItemsFromShoppingList,
    );
    this.loginButtonElement.addEventListener('click', this.loginWithGoogle);
    this.logoutButtonElement.addEventListener('click', this.logout);

    if (this.modalCloseButton) {
      this.modalCloseButton.addEventListener('click', this.closeModal);
    }
  }
}

export default ShoppingList;
