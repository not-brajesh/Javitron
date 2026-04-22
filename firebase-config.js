// Firebase Configuration - Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDPHtx1sQQ6lpaUKzM8U6Hkg9kHNjJt19w",
    authDomain: "javitron-cbe04.firebaseapp.com",
    projectId: "javitron-cbe04",
    storageBucket: "javitron-cbe04.firebasestorage.app",
    messagingSenderId: "433920700552",
    appId: "1:433920700552:web:7932125587d4b91b07ef3d",
    measurementId: "G-F2K6S0NY84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
