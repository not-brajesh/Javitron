// Profile Page Functions - Modular SDK
import { app, auth, db } from "./firebase-config.js";
import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const goToWebsiteBtn = document.getElementById('goToWebsiteBtn');
    const chatBtn = document.getElementById('chatBtn');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const loading = document.getElementById('loading');
    const profileContent = document.getElementById('profileContent');

    console.log('DOM loaded - editProfileBtn:', editProfileBtn);

    // Admin Panel
    if (adminPanelBtn) {
        adminPanelBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    // Chat
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            window.location.href = 'chat.html';
        });
    }

    // Go to Website
    if (goToWebsiteBtn) {
        goToWebsiteBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

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

                // Show admin button if user is admin (check multiple possible field names)
                console.log('User data:', userData);
                console.log('Role:', userData.role);
                console.log('Team role:', userData.teamRole);

                const isAdmin = userData.role === 'admin' ||
                               userData.teamRole === 'admin' ||
                               userData.role === 'Admin' ||
                               userData.teamRole === 'Admin';

                console.log('Is admin:', isAdmin);

                if (isAdmin) {
                    adminPanelBtn.classList.remove('hidden');
                }

                // Load team members
                loadTeamMembers(userData.department);
            } else {
                // User document doesn't exist, redirect to complete profile
                window.location.href = 'complete-profile.html';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            loading.innerHTML = '<p style="color: #ff6b6b;">Error loading profile. Please try again.</p>';
        }
    }

    // Load team members
    async function loadTeamMembers(userDepartment) {
        try {
            const teamMembersGrid = document.getElementById('teamMembersGrid');
            if (!teamMembersGrid) return;

            // Query users by department
            const usersQuery = query(
                collection(db, 'users'),
                where('department', '==', userDepartment)
            );

            const querySnapshot = await getDocs(usersQuery);
            let membersHTML = '';

            querySnapshot.forEach((doc) => {
                const memberData = doc.data();
                const memberUID = doc.id;

                // Skip current user
                if (memberUID === auth.currentUser.uid) return;

                const photoHTML = memberData.photoURL
                    ? `<img src="${memberData.photoURL}" alt="${memberData.name}">`
                    : '<i class="fas fa-user"></i>';

                const name = memberData.name || 'Unknown';
                const role = memberData.role ? memberData.role.charAt(0).toUpperCase() + memberData.role.slice(1) : 'Member';

                membersHTML += `
                    <div class="team-member-card">
                        <div class="team-member-photo">
                            ${photoHTML}
                        </div>
                        <div class="team-member-name">${name}</div>
                        <div class="team-member-role">${role}</div>
                    </div>
                `;
            });

            teamMembersGrid.innerHTML = membersHTML || '<p style="color: rgba(255,255,255,0.6); grid-column: 1/-1; text-align: center;">No team members found in your department.</p>';
        } catch (error) {
            console.error('Error loading team members:', error);
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
