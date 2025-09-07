// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5XJZFCldnlDGfxZDs2Q4oGe0yZQPrTdE",
  authDomain: "studybuddy-fd04e.firebaseapp.com",
  projectId: "studybuddy-fd04e",
  storageBucket: "studybuddy-fd04e.firebasestorage.app",
  messagingSenderId: "449566022317",
  appId: "1:449566022317:web:653d07bbe3629f943c0424",
  measurementId: "G-WEJTTNQNE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
