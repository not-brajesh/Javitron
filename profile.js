// Profile Page Functions - Modular SDK
import { app, auth, db } from "./firebase-config.js";
import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const loading = document.getElementById('loading');
    const profileContent = document.getElementById('profileContent');

    console.log('DOM loaded - editProfileBtn:', editProfileBtn);

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }

    // Edit Profile
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', async () => {
            console.log('Edit profile button clicked');
            try {
                const user = auth.currentUser;
                if (!user) {
                    window.location.href = 'login.html';
                    return;
                }

                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Store current profile data in sessionStorage
                    sessionStorage.setItem('editProfileData', JSON.stringify(userData));
                    console.log('Redirecting to complete-profile.html with edit=true');
                    window.location.href = 'complete-profile.html?edit=true';
                }
            } catch (error) {
                console.error('Error loading profile for edit:', error);
            }
        });
    } else {
        console.error('Edit profile button not found');
    }

    // Load user profile
    async function loadProfile() {
        const user = auth.currentUser;
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Update profile photo
                const profilePhoto = document.getElementById('profilePhoto');
                if (userData.photoURL) {
                    profilePhoto.innerHTML = `<img src="${userData.photoURL}" alt="Profile Photo">`;
                }

                // Update profile name
                document.getElementById('profileName').textContent = userData.name || 'No Name';

                // Update profile email
                document.getElementById('profileEmail').textContent = userData.email || 'No Email';

                // Update profile role
                const roleText = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Member';
                document.getElementById('profileRole').textContent = roleText;

                // Update department
                document.getElementById('profileDepartment').textContent = userData.department || 'Not Specified';

                // Update LinkedIn
                const linkedinLink = document.getElementById('profileLinkedin');
                if (userData.linkedin) {
                    linkedinLink.href = userData.linkedin;
                    linkedinLink.textContent = 'View Profile';
                } else {
                    linkedinLink.href = '#';
                    linkedinLink.textContent = 'Not Added';
                }

                // Update Instagram
                const instagramLink = document.getElementById('profileInstagram');
                if (userData.instagram) {
                    instagramLink.href = userData.instagram;
                    instagramLink.textContent = 'View Profile';
                } else {
                    instagramLink.href = '#';
                    instagramLink.textContent = 'Not Added';
                }

                // Update WhatsApp
                document.getElementById('profileWhatsapp').textContent = userData.whatsapp || 'Not Added';

                // Update bio
                if (userData.bio) {
                    document.getElementById('bioSection').style.display = 'block';
                    document.getElementById('profileBio').textContent = userData.bio;
                }

                // Show profile content
                loading.style.display = 'none';
                profileContent.style.display = 'block';
            } else {
                // User document doesn't exist, redirect to complete profile
                window.location.href = 'complete-profile.html';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            loading.innerHTML = '<p style="color: #ff6b6b;">Error loading profile. Please try again.</p>';
        }
    }

    // Check authentication
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadProfile();
        } else {
            window.location.href = 'login.html';
        }
    });
});
