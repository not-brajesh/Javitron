// Profile Completion Functions - Modular SDK
import { app, auth, db, storage } from "./firebase-config.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const profileForm = document.getElementById('profileForm');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.querySelector('.btn-submit');

let photoFile = null;
let isEditMode = false;

// Check if edit mode
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('edit') === 'true') {
    isEditMode = true;
    submitBtn.textContent = 'Update Profile';
}

// Photo upload preview
photoPreview.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        photoFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
        };
        reader.readAsDataURL(file);
    }
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

// Upload photo to Firebase Storage
async function uploadPhoto(userId, file) {
    if (!file) return null;

    const storageRef = ref(storage, `profile-photos/${userId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}

// Load existing profile data for edit
async function loadExistingProfile() {
    const editData = sessionStorage.getItem('editProfileData');
    if (editData) {
        const userData = JSON.parse(editData);

        // Pre-fill form fields
        document.getElementById('department').value = userData.department || '';
        document.getElementById('role').value = userData.role || '';
        document.getElementById('linkedin').value = userData.linkedin || '';
        document.getElementById('instagram').value = userData.instagram || '';
        document.getElementById('whatsapp').value = userData.whatsapp || '';
        document.getElementById('bio').value = userData.bio || '';

        // Show existing photo
        if (userData.photoURL) {
            photoPreview.innerHTML = `<img src="${userData.photoURL}" alt="Profile Photo">`;
        }

        sessionStorage.removeItem('editProfileData');
    }
}

// Submit profile form
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const user = auth.currentUser;
    if (!user) {
        showError('Please login first');
        window.location.href = 'login.html';
        return;
    }

    try {
        profileForm.classList.add('loading');

        // Upload photo if selected
        let photoURL = user.photoURL;
        if (photoFile) {
            photoURL = await uploadPhoto(user.uid, photoFile);
        } else if (isEditMode) {
            // Keep existing photo if not changed in edit mode
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                photoURL = userDoc.data().photoURL || user.photoURL;
            }
        }

        const profileData = {
            department: document.getElementById('department').value,
            role: document.getElementById('role').value,
            linkedin: document.getElementById('linkedin').value,
            instagram: document.getElementById('instagram').value,
            whatsapp: document.getElementById('whatsapp').value,
            bio: document.getElementById('bio').value,
            photoURL: photoURL,
            profileCompleted: true,
            updatedAt: serverTimestamp()
        };

        if (isEditMode) {
            // Update existing profile
            await updateDoc(doc(db, 'users', user.uid), profileData);
            showSuccess('Profile updated successfully! Redirecting to profile page...');
        } else {
            // Create new profile
            profileData.createdAt = serverTimestamp();
            await setDoc(doc(db, 'users', user.uid), profileData);
            showSuccess('Profile completed successfully! Redirecting to profile page...');
        }

        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    } catch (error) {
        profileForm.classList.remove('loading');
        showError(error.message);
    }
});

// Check authentication
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        if (isEditMode) {
            loadExistingProfile();
        } else {
            // Check if profile is already completed
            getDoc(doc(db, 'users', user.uid)).then((doc) => {
                if (doc.exists() && doc.data().profileCompleted) {
                    window.location.href = 'profile.html';
                }
            });
        }
    }
});
