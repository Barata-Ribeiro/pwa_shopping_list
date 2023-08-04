class App {
  constructor(containerId) {
    this.containerId = containerId;
  }

  render() {
    const appElement = document.getElementById(this.containerId);

    if (appElement) {
      appElement.innerHTML = '<h1>Hello, world!</h1>';
    } else {
      console.error(`Element with id '${this.containerId}' not found.`);
    }
  }
}

export default App;
