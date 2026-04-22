// Firebase Configuration
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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
