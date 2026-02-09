// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get these from Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
    apiKey: "AIzaSyAaM8jV45wDyDuEr8Xa7BGw2um6cIjZgHA",
    authDomain: "student-result-managemen-bccc1.firebaseapp.com",
    projectId: "student-result-managemen-bccc1",
    storageBucket: "student-result-managemen-bccc1.firebasestorage.app",
    messagingSenderId: "191820420094",
    appId: "1:191820420094:web:d909d495b8e9ec862fe6af"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
