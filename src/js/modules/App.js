class App {
  constructor(containerId) {
    this.containerId = containerId;
  }

  // eslint-disable-next-line class-methods-use-this
  createElements() {
    const mainContainer = document.createElement('main');
    mainContainer.className = 'add-to-cart__container';

    // Image Element
    const imageEl = document.createElement('img');
    imageEl.className = 'add-to-cart__image';
    imageEl.src = '/assets/images/undraw_shopping_app_flsj.svg';
    imageEl.alt = 'image';
    mainContainer.appendChild(imageEl);

    // Input Element
    const inputEl = document.createElement('input');
    inputEl.className = 'add-to-cart__input';
    inputEl.type = 'text';
    inputEl.id = 'input-field';
    inputEl.placeholder = 'Enter product name';
    inputEl.required = true;
    mainContainer.appendChild(inputEl);

    // Error Element
    const errorEl = document.createElement('span');
    errorEl.className = 'add-to-cart__error';
    errorEl.id = 'error-message';
    errorEl.textContent = '';
    mainContainer.appendChild(errorEl);

    // Button Element
    const buttonEl = document.createElement('button');
    buttonEl.className = 'add-to-cart__button';
    buttonEl.id = 'add-button';
    buttonEl.type = 'button';
    buttonEl.textContent = 'Add to cart';
    mainContainer.appendChild(buttonEl);

    // List Element
    const listEl = document.createElement('ul');
    listEl.className = 'add-to-cart__list';
    listEl.id = 'shopping-list';
    mainContainer.appendChild(listEl);

    return mainContainer;
  }

  render() {
    const appElement = document.getElementById(this.containerId);

    if (appElement) appElement.appendChild(this.createElements());
    else throw new Error(`Element with id '${this.containerId}' not found.`);
  }
}

export default App;
