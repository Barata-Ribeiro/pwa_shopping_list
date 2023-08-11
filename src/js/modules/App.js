class App {
  constructor(containerId) {
    this.containerId = containerId;
  }

  // eslint-disable-next-line class-methods-use-this
  createElements() {
    const mainContainer = document.createElement('main');
    mainContainer.className = 'add-to-cart__container';

    // Login Button Element
    const loginButtonEl = document.createElement('button');
    loginButtonEl.className = 'login__button';
    loginButtonEl.id = 'login-button';
    loginButtonEl.type = 'button';
    loginButtonEl.textContent = 'Login with Google';
    mainContainer.appendChild(loginButtonEl);

    // Logout Button Element
    const logoutButtonEl = document.createElement('button');
    logoutButtonEl.className = 'logout__button';
    logoutButtonEl.id = 'logout-button';
    logoutButtonEl.type = 'button';
    logoutButtonEl.textContent = 'Logout';
    logoutButtonEl.style.display = 'none';
    mainContainer.appendChild(logoutButtonEl);

    // Theme Switcher Toggle Element
    const themeSwitcherContainerEl = document.createElement('div');
    themeSwitcherContainerEl.className = 'theme-switcher__container';

    const themeSwitcherEl = document.createElement('input');
    themeSwitcherEl.className = 'theme-switcher__input';
    themeSwitcherEl.id = 'theme-switcher';
    themeSwitcherEl.type = 'checkbox';
    themeSwitcherEl.addEventListener('change', App.toggleTheme);
    themeSwitcherContainerEl.appendChild(themeSwitcherEl);

    const themeSwitcherLabelEl = document.createElement('label');
    themeSwitcherLabelEl.className = 'theme-switcher__label';
    themeSwitcherLabelEl.htmlFor = 'theme-switcher';
    themeSwitcherContainerEl.appendChild(themeSwitcherLabelEl);

    mainContainer.appendChild(themeSwitcherContainerEl);

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

    // Error Modal Element
    const errorModalEl = document.createElement('div');
    errorModalEl.className = 'error-modal__container';
    errorModalEl.id = 'error-modal-container';
    const errorModalDiv = document.createElement('div');
    errorModalDiv.className = 'error-modal__content';
    errorModalEl.appendChild(errorModalDiv);
    const errorModalCloseButton = document.createElement('span');
    errorModalCloseButton.className = 'error-modal__close-button';
    errorModalCloseButton.textContent = '&times;';
    errorModalDiv.appendChild(errorModalCloseButton);
    const errorModalP = document.createElement('p');
    errorModalP.className = 'error-modal__text';
    errorModalP.id = 'modal-error-message';
    errorModalP.textContent = '';
    errorModalDiv.appendChild(errorModalP);

    return mainContainer;
  }

  static toggleTheme() {
    const { body } = document;
    let newTheme = 'light-theme'; // default to light-theme

    if (
      body.classList.contains('dark-theme') ||
      (!body.classList.contains('light-theme') &&
        !body.classList.contains('dark-theme'))
    ) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      newTheme = 'dark-theme';
    }

    // Save the current theme to local storage
    localStorage.setItem('theme', newTheme);
  }

  static initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const { body } = document;

    if (savedTheme) {
      body.classList.add(savedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      body.classList.add('dark-theme');
    } else {
      body.classList.add('light-theme');
    }
  }

  render() {
    const appElement = document.getElementById(this.containerId);

    App.initializeTheme();

    if (appElement) appElement.appendChild(this.createElements());
    else throw new Error(`Element with id '${this.containerId}' not found.`);
  }
}

export default App;
