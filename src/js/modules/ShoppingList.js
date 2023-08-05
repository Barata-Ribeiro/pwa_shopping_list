import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

class ShoppingList {
  constructor() {
    this.loginButtonElement = document.querySelector('#login-button');
    this.logoutButtonElement = document.querySelector('#logout-button');
    this.inputFieldElement = document.querySelector('#input-field');
    this.addButtonElement = document.querySelector('#add-button');
    this.addButtonElement.disabled = true;
    this.errorMessageElement = document.querySelector('#error-message');
    this.shoppingListElement = document.querySelector('#shopping-list');

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
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
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
      console.error('Error during sign-in: ', error);
    }
  }

  async logout() {
    try {
      await this.firebaseAuth.signOut();
    } catch (error) {
      console.error('Error during sign-out: ', error);
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
    if (event.target && event.target.nodeName === 'LI') {
      const locationOfItemInDB = ref(
        this.firebaseDatabase,
        `users/${this.userId}/shoppingList/${event.target.id}`,
      );

      remove(locationOfItemInDB).catch((error) => {
        console.error('Error removing item: ', error);
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
      push(this.firebaseShoppingListRef, inputValue);
      this.clearInputFieldElement();
    } else {
      console.error(
        'User not logged in: firebaseShoppingListRef is not defined',
      );
    }
  }

  renderShoppingList() {
    if (this.firebaseShoppingListRef) {
      onValue(this.firebaseShoppingListRef, (snapshot) => {
        if (snapshot.exists()) {
          const snapshotData = snapshot.val();
          const emptyElement = document.querySelector(
            '.add-to-cart__empty-list',
          );

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
    } else {
      console.error('firebaseShoppingListRef is not defined');
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
      'click',
      this.deleteItemsFromShoppingList,
    );
    this.loginButtonElement.addEventListener('click', this.loginWithGoogle);
    this.logoutButtonElement.addEventListener('click', async () => {
      await this.logout();
    });
  }
}

export default ShoppingList;
