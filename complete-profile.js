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

// Add user to team members localStorage
function addToTeamMembers(user, profileData) {
    try {
        // Get existing team members
        let teamMembers = localStorage.getItem('teamMembers');
        let membersArray = teamMembers ? JSON.parse(teamMembers) : [];

        // Check if user already exists
        const existingIndex = membersArray.findIndex(m => m.uid === user.uid);

        // Create member object
        const memberData = {
            uid: user.uid,
            name: user.displayName || profileData.name || 'Team Member',
            role: getRoleLabel(profileData.role),
            badge: getRoleLabel(profileData.role),
            department: profileData.department,
            image: profileData.photoURL || 'assets/team/image_9', // Fallback image
            linkedin: profileData.linkedin || '#',
            instagram: profileData.instagram || '#'
        };

        // Update or add member
        if (existingIndex >= 0) {
            membersArray[existingIndex] = memberData;
        } else {
            membersArray.push(memberData);
        }

        // Save to localStorage
        localStorage.setItem('teamMembers', JSON.stringify(membersArray));
    } catch (error) {
        console.error('Error adding to team members:', error);
    }
}

// Get role label from role value
function getRoleLabel(role) {
    const roleLabels = {
        'member': 'Team Member',
        'lead': 'Team Lead',
        'vice-captain': 'Vice Captain',
        'captain': 'Captain',
        'admin': 'Admin'
    };
    return roleLabels[role] || 'Team Member';
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

// Submit profile form (optimized with timeout)
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

        // Simple approach - don't fetch existing data in edit mode, just use what's there
        let photoURL = user.photoURL;

        // Upload photo if selected
        if (photoFile) {
            showLoading('Uploading photo...');
            try {
                const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}_${photoFile.name}`);
                const snapshot = await uploadBytes(storageRef, photoFile);
                photoURL = await getDownloadURL(snapshot.ref);
            } catch (uploadError) {
                console.error('Photo upload failed:', uploadError);
                // Continue with existing photo if upload fails
                photoURL = user.photoURL;
            }
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

        // Save to Firestore with timeout
        const savePromise = isEditMode
            ? updateDoc(doc(db, 'users', user.uid), profileData)
            : setDoc(doc(db, 'users', user.uid), profileData);

        if (!isEditMode) {
            profileData.createdAt = serverTimestamp();
        }

        // Add timeout to prevent hanging
        await Promise.race([
            savePromise,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Save timeout')), 10000)
            )
        ]);

        hideLoading();
        showSuccess(isEditMode ? 'Profile updated successfully!' : 'Profile completed successfully!');

        // Add to team members localStorage
        addToTeamMembers(user, profileData);

        // Quick redirect
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 500);
    } catch (error) {
        hideLoading();
        console.error('Profile update error:', error);
        if (error.message === 'Save timeout') {
            showError('Update taking too long. Please try again.');
        } else {
            showError(error.message || 'Failed to update profile. Please try again.');
        }
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
