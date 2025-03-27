const { initializeApp } = require("firebase/app");

require("dotenv").config();

const firebaseConfig = {
  apiKey: "AIzaSyAiMgZW1MhUhsr2L7bit3zYXnJMC6cP8zs",
  authDomain: "doubles-fab11.firebaseapp.com",
  projectId: "doubles-fab11",
  storageBucket: "doubles-fab11.firebasestorage.app",
  messagingSenderId: "641669311127",
  appId: "1:641669311127:web:4d54ddf3d7b4f8aae9d7d2",
  measurementId: "G-L8G3DYT1MK",
};

const app = initializeApp(firebaseConfig);

module.exports = app;
