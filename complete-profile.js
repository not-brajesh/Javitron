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
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');

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

// Show loading overlay
function showLoading(text = 'Updating profile...') {
    loadingText.textContent = text;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

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

// Upload photo to Firebase Storage (optimized)
async function uploadPhoto(userId, file) {
    if (!file) return null;

    try {
        const storageRef = ref(storage, `profile-photos/${userId}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error('Photo upload error:', error);
        throw error;
    }
}

// Load existing profile data for edit (optimized)
async function loadExistingProfile() {
    const editData = sessionStorage.getItem('editProfileData');
    if (editData) {
        try {
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
        } catch (error) {
            console.error('Error loading existing profile:', error);
        }
    }
}

// Submit profile form (optimized)
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
        showLoading('Updating profile...');

        // Get existing data first (only in edit mode)
        let existingPhotoURL = user.photoURL;
        if (isEditMode) {
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    existingPhotoURL = userDoc.data().photoURL || user.photoURL;
                }
            } catch (error) {
                console.error('Error fetching existing data:', error);
            }
        }

        // Upload photo if selected (parallel processing)
        let photoURL = existingPhotoURL;
        if (photoFile) {
            showLoading('Uploading photo...');
            photoURL = await uploadPhoto(user.uid, photoFile);
        }

        // Prepare profile data
        showLoading('Saving profile...');
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

        // Save to Firestore
        if (isEditMode) {
            await updateDoc(doc(db, 'users', user.uid), profileData);
        } else {
            profileData.createdAt = serverTimestamp();
            await setDoc(doc(db, 'users', user.uid), profileData);
        }

        hideLoading();
        showSuccess(isEditMode ? 'Profile updated successfully!' : 'Profile completed successfully!');

        // Quick redirect
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 800);
    } catch (error) {
        hideLoading();
        console.error('Profile update error:', error);
        showError(error.message || 'Failed to update profile. Please try again.');
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
            }).catch(error => {
                console.error('Error checking profile status:', error);
            });
        }
    }
});
