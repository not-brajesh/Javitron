// Admin Panel Functions - Modular SDK
import { app, auth, db } from "./firebase-config.js";
import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    query,
    collection,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const logoutBtn = document.getElementById('logoutBtn');
const goToProfileBtn = document.getElementById('goToProfileBtn');
const generateCodeForm = document.getElementById('generateCodeForm');
const removeMemberForm = document.getElementById('removeMemberForm');
const codeDisplay = document.getElementById('codeDisplay');
const generatedCode = document.getElementById('generatedCode');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const codesList = document.getElementById('codesList');
const membersList = document.getElementById('membersList');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const adminContent = document.getElementById('adminContent');
const removeMemberResult = document.getElementById('removeMemberResult');
const editMemberModal = document.getElementById('editMemberModal');
const editMemberForm = document.getElementById('editMemberForm');
const cancelEditMemberBtn = document.getElementById('cancelEditMember');
let currentEditingMemberId = null;

// Go to Profile
if (goToProfileBtn) {
    goToProfileBtn.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
}

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Remove Member
if (removeMemberForm) {
    removeMemberForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('removeMemberEmail').value;

        if (!confirm(`Are you sure you want to remove member with email: ${email}? This action cannot be undone.`)) {
            return;
        }

        try {
            removeMemberResult.style.display = 'block';
            removeMemberResult.style.background = 'rgba(255, 255, 255, 0.1)';
            removeMemberResult.innerHTML = '<p>Searching for member...</p>';

            // Find user by email
            const usersSnapshot = await getDocs(collection(db, 'users'));
            let foundUser = null;
            let foundUserId = null;

            for (const userDoc of usersSnapshot.docs) {
                if (userDoc.data().email === email) {
                    foundUser = userDoc.data();
                    foundUserId = userDoc.id;
                    break;
                }
            }

            if (!foundUser) {
                removeMemberResult.style.background = 'rgba(255, 0, 0, 0.2)';
                removeMemberResult.innerHTML = '<p style="color: #ff6b6b;">Member not found with this email.</p>';
                return;
            }

            removeMemberResult.innerHTML = `<p>Found member: ${foundUser.name || foundUser.email}. Removing...</p>`;

            // Delete user from Firestore
            await deleteDoc(doc(db, 'users', foundUserId));

            removeMemberResult.style.background = 'rgba(0, 255, 0, 0.2)';
            removeMemberResult.innerHTML = `<p style="color: #4ade80;">Successfully removed member: ${foundUser.name || foundUser.email}</p>`;

            // Clear form
            removeMemberForm.reset();

            console.log('Member removed successfully:', foundUserId);

        } catch (error) {
            removeMemberResult.style.background = 'rgba(255, 0, 0, 0.2)';
            removeMemberResult.innerHTML = `<p style="color: #ff6b6b;">Error: ${error.message}</p>`;
            console.error('Error removing member:', error);
        }
    });
}

// Load all members
async function loadMembers() {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        membersList.innerHTML = '';

        if (usersSnapshot.empty) {
            membersList.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">No members found.</p>';
            return;
        }

        usersSnapshot.forEach(doc => {
            const member = doc.data();
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';
            memberItem.innerHTML = `
                <div class="member-info">
                    <h4>${member.name || member.email}</h4>
                    <p>${member.email}</p>
                    <p>Department: ${member.department || 'Not specified'}</p>
                    <span class="member-role">${member.role || 'member'}</span>
                </div>
                <div class="member-actions">
                    <button class="btn-edit-member" onclick="editMember('${doc.id}', '${member.name || ''}', '${member.role || 'member'}', '${member.department || 'Mechanical'}')">
                        Edit
                    </button>
                    <button class="btn-remove-member" onclick="removeMember('${doc.id}', '${member.name || member.email}')">
                        Remove
                    </button>
                </div>
            `;
            membersList.appendChild(memberItem);
        });
    } catch (error) {
        console.error('Error loading members:', error);
        membersList.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Error loading members.</p>';
    }
}

// Edit member
window.editMember = function(memberId, name, role, department) {
    currentEditingMemberId = memberId;
    document.getElementById('editMemberName').value = name;
    document.getElementById('editMemberRole').value = role;
    document.getElementById('editMemberDepartment').value = department;
    editMemberModal.classList.add('active');
};

// Cancel edit member
if (cancelEditMemberBtn) {
    cancelEditMemberBtn.addEventListener('click', () => {
        editMemberModal.classList.remove('active');
        currentEditingMemberId = null;
    });
}

// Save member changes
if (editMemberForm) {
    editMemberForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('editMemberName').value;
        const newRole = document.getElementById('editMemberRole').value;
        const newDepartment = document.getElementById('editMemberDepartment').value;

        try {
            await updateDoc(doc(db, 'users', currentEditingMemberId), {
                name: newName,
                role: newRole,
                teamRole: newRole,
                department: newDepartment
            });

            editMemberModal.classList.remove('active');
            currentEditingMemberId = null;
            loadMembers();
            alert('Member updated successfully!');
        } catch (error) {
            console.error('Error updating member:', error);
            alert('Error updating member: ' + error.message);
        }
    });
}

// Remove member
window.removeMember = function(memberId, memberName) {
    if (!confirm(`Are you sure you want to remove ${memberName}? This action cannot be undone.`)) {
        return;
    }

    deleteDoc(doc(db, 'users', memberId))
        .then(() => {
            loadMembers();
            alert('Member removed successfully!');
        })
        .catch(error => {
            console.error('Error removing member:', error);
            alert('Error removing member: ' + error.message);
        });
};

// Generate random team code
function generateTeamCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'JAVITRON-';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Copy code to clipboard
copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(generatedCode.textContent).then(() => {
        copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyCodeBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
        }, 2000);
    });
});

// Generate team code
generateCodeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const memberName = document.getElementById('memberName').value;
    const memberRole = document.getElementById('memberRole').value;
    const memberDepartment = document.getElementById('memberDepartment').value;

    try {
        const code = generateTeamCode();

        // Create team code document in Firestore
        await setDoc(doc(db, 'teamCodes', code), {
            code: code,
            memberName: memberName,
            role: memberRole,
            department: memberDepartment,
            used: false,
            createdAt: serverTimestamp(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        // Display generated code
        generatedCode.textContent = code;
        codeDisplay.classList.add('active');

        // Refresh codes list
        loadTeamCodes();

        // Reset form
        generateCodeForm.reset();
    } catch (error) {
        showError(error.message);
    }
});

// Load team codes
async function loadTeamCodes() {
    try {
        const q = query(
            collection(db, 'teamCodes'),
            orderBy('createdAt', 'desc'),
            limit(20)
        );
        const snapshot = await getDocs(q);

        codesList.innerHTML = '';

        if (snapshot.empty) {
            codesList.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6); font-family: Outfit, sans-serif;">No team codes generated yet.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const codeData = doc.data();
            const codeItem = document.createElement('div');
            codeItem.className = 'code-item';

            const statusClass = codeData.used ? 'used' : 'active';
            const statusText = codeData.used ? 'Used' : 'Active';

            codeItem.innerHTML = `
                <div class="code-info">
                    <h4>${codeData.code}</h4>
                    <p>${codeData.memberName} - ${codeData.role} (${codeData.department})</p>
                </div>
                <div class="code-status ${statusClass}">${statusText}</div>
            `;

            codesList.appendChild(codeItem);
        });
    } catch (error) {
        console.error('Error loading team codes:', error);
    }
}

// Check if user is admin
async function checkAdminAccess() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            window.location.href = 'complete-profile.html';
            return;
        }

        const userData = userDoc.data();

        console.log('User data:', userData);
        console.log('User role:', userData.role);
        console.log('User teamRole:', userData.teamRole);

        // Save user data to localStorage for admin checks
        localStorage.setItem('currentUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: userData.role,
            teamRole: userData.teamRole
        }));

        // Check if user has admin role
        if (userData.role !== 'admin' && userData.teamRole !== 'admin') {
            console.log('Access denied - user is not admin');
            showError('Access denied. Admin privileges required.');
            loading.innerHTML = '<p style="color: #ff6b6b;">Access denied. Admin privileges required.</p>';
            loading.innerHTML += '<p style="margin-top: 10px; font-size: 0.9rem;">Your role: ' + (userData.role || 'none') + '</p>';
            return;
        }

        console.log('Access granted - user is admin');
        // User is admin, show admin content
        loading.style.display = 'none';
        adminContent.style.display = 'block';
        loadTeamCodes();
        loadMembers();
    } catch (error) {
        console.error('Error checking admin access:', error);
        showError('Error checking admin access. Please try again.');
    }
}

// Check authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        checkAdminAccess();
    } else {
        window.location.href = 'login.html';
    }
});
