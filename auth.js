// Authentication Functions - Modular SDK
import { app, auth, db } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Set Auth Persistence to LOCAL (keeps user logged in across browser sessions)
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Error setting auth persistence:', error);
});

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const googleAuthBtn = document.getElementById('googleAuthBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Tab switching
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    clearMessages();
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    clearMessages();
});

// Clear messages
function clearMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

// Show success message
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        loginForm.classList.add('loading');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showSuccess('Login successful! Redirecting...');

        // Check if user profile exists
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Check if user is admin
            const isAdmin = userData.role === 'admin' || userData.teamRole === 'admin';

            // Redirect to admin page if admin, otherwise profile page
            setTimeout(() => {
                window.location.href = isAdmin ? 'admin.html' : 'profile.html';
            }, 1500);
        } else {
            // Redirect to complete profile
            setTimeout(() => {
                window.location.href = 'complete-profile.html';
            }, 1500);
        }
    } catch (error) {
        loginForm.classList.remove('loading');
        showError(error.message);
    }
});

// Email/Password Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const teamCode = document.getElementById('teamCode').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    try {
        registerForm.classList.add('loading');

        // Verify team code
        const teamCodeDoc = await getDoc(doc(db, 'teamCodes', teamCode));

        if (!teamCodeDoc.exists()) {
            registerForm.classList.remove('loading');
            showError('Invalid team code. Please contact your team admin for the correct code.');
            return;
        }

        const teamCodeData = teamCodeDoc.data();

        // Check if team code is still valid
        if (teamCodeData.used) {
            registerForm.classList.remove('loading');
            showError('This team code has already been used. Please contact your team admin.');
            return;
        }

        // Check if team code is expired
        if (teamCodeData.expiresAt && teamCodeData.expiresAt.toDate() < new Date()) {
            registerForm.classList.remove('loading');
            showError('This team code has expired. Please contact your team admin.');
            return;
        }

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: name,
            email: email,
            teamCode: teamCode,
            teamRole: teamCodeData.role || 'member',
            createdAt: serverTimestamp(),
            role: 'member', // Default role
            profileCompleted: false
        });

        // Mark team code as used
        await updateDoc(doc(db, 'teamCodes', teamCode), {
            used: true,
            usedBy: userCredential.user.uid,
            usedAt: serverTimestamp()
        });

        showSuccess('Registration successful! Redirecting to complete profile...');

        setTimeout(() => {
            window.location.href = 'complete-profile.html';
        }, 1500);
    } catch (error) {
        registerForm.classList.remove('loading');
        showError(error.message);
    }
});

// Google Authentication
if (googleAuthBtn) {
    console.log('Google login button found');
    googleAuthBtn.addEventListener('click', async () => {
        console.log('Google login button clicked');
        clearMessages();
        googleAuthBtn.classList.add('loading');

        try {
            console.log('Attempting Google sign in...');
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log('Google sign in successful:', user.email);

            // Check if user profile exists
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (!userDoc.exists()) {
                console.log('User document does not exist, creating...');
                // Create user document
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                    role: 'member',
                    profileCompleted: false
                });

                showSuccess('Google login successful! Redirecting to complete profile...');
                setTimeout(() => {
                    window.location.href = 'complete-profile.html';
                }, 1500);
            } else {
                console.log('User document exists');
                const userData = userDoc.data();

                // Check if user is admin
                const isAdmin = userData.role === 'admin' || userData.teamRole === 'admin';
                console.log('Is admin:', isAdmin);

                // Redirect to admin page if admin, otherwise profile page
                showSuccess('Google login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = isAdmin ? 'admin.html' : 'profile.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Google login error:', error);
            googleAuthBtn.classList.remove('loading');
            showError(error.message);
        }
    });
} else {
    console.log('Google login button not found');
}

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
    } else {
        // User is signed out
        console.log('User is signed out');
    }
});
