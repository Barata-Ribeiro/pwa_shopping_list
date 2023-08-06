# My Shopping List

## 🌐 Description

A progressive web application (PWA) designed for users to maintain a shopping list. Instead of using paper, you can use your phone and simply write the product, to remind you what to buy. Originally inspired by a [freeCodeCamp tutorial](https://www.youtube.com/watch?v=UFD4SP91tSM), this project was enhanced to cater to individual user needs instead of personal usage. It includes:

- Firebase Rules that ensure unique list per user
- Google Login/Logout functionality
- Loading spinners for better user experience
- Enhanced error handling

Hopefully some future implementations will include a theme switcher and more...

You can find the demo here > [Demo](https://pwa-shopping-list.vercel.app/)

## 🚀 Built With

- JavaScript
- HTML
- CSS
- Firebase Realtime Database
- Firebase Authentication

## 🛠️ Project Setup

1. Clone the project from the repository:

   ```bash
   git clone https://github.com/Barata-Ribeiro/pwa_shopping_list.git
   ```

2. Navigate to the project directory:

   ```bash
   cd pwa_shopping_list
   ```

3. Install the required packages (If you're using npm or any other package manager):

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

Keep in mind that if you plan on running this application yourself, you will have to create a Firebase account and deploy your own Realtime Database.

Then you must create a `.env` file in your project that contains the following information:

```bash
VITE_FIREBASE_API_KEY='YOUR_API_KEY_HERE'
VITE_FIREBASE_AUTH_DOMAIN='YOUR_AUTH_DOMAIN_HERE'
VITE_FIREBASE_DATABASE_URL='YOUR_DATABASE_URL_HERE'
VITE_FIREBASE_PROJECT_ID='YOUR_PROJECT_ID_HERE'
VITE_FIREBASE_STORAGE_BUCKET='YOUR_STORAGE_BUCKET_HERE'
VITE_FIREBASE_APP_ID='YOUR_APP_ID_HERE'
VITE_FIREBASE_MESSAGE_SENDER_ID="YOUR_MESSAGE_SENDER_ID"
```

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please ensure to update tests as appropriate and adhere to the coding standards of the project.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Barata-Ribeiro/pwa_shopping_list/blob/main/LICENSE.md) file for details.
