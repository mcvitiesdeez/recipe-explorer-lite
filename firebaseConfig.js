// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHRqm6us6eOOwqSWrYi-XhFYgBWylXts4",
  authDomain: "recipe-explorer-lite.firebaseapp.com",
  projectId: "recipe-explorer-lite",
  storageBucket: "recipe-explorer-lite.firebasestorage.app",
  messagingSenderId: "137570209502",
  appId: "1:137570209502:web:a81b8c83a9f3c01719fc4f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db, app };
