// Profile Completion Functions
const profileForm = document.getElementById('profileForm');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

let photoFile = null;

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

    const storageRef = storage.ref(`profile-photos/${userId}/${Date.now()}_${file.name}`);
    const snapshot = await storageRef.put(file);
    return await snapshot.ref.getDownloadURL();
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
        }

        // Update user profile in Firestore
        await db.collection('users').doc(user.uid).update({
            department: document.getElementById('department').value,
            role: document.getElementById('role').value,
            linkedin: document.getElementById('linkedin').value,
            instagram: document.getElementById('instagram').value,
            whatsapp: document.getElementById('whatsapp').value,
            bio: document.getElementById('bio').value,
            photoURL: photoURL,
            profileCompleted: true,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showSuccess('Profile completed successfully! Redirecting to profile page...');

        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    } catch (error) {
        profileForm.classList.remove('loading');
        showError(error.message);
    }
});

// Check authentication
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        // Check if profile is already completed
        db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.exists && doc.data().profileCompleted) {
                window.location.href = 'profile.html';
            }
        });
    }
});
