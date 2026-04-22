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
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const logoutBtn = document.getElementById('logoutBtn');
const goToProfileBtn = document.getElementById('goToProfileBtn');
const generateCodeForm = document.getElementById('generateCodeForm');
const makeMeAdminBtn = document.getElementById('makeMeAdminBtn');
const codeDisplay = document.getElementById('codeDisplay');
const generatedCode = document.getElementById('generatedCode');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const codesList = document.getElementById('codesList');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const adminContent = document.getElementById('adminContent');
const makeAdminResult = document.getElementById('makeAdminResult');

// Go to Profile
if (goToProfileBtn) {
    goToProfileBtn.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
}

// Make Me Admin
if (makeMeAdminBtn) {
    makeMeAdminBtn.addEventListener('click', async () => {
        const user = auth.currentUser;

        if (!user) {
            makeAdminResult.style.display = 'block';
            makeAdminResult.style.background = 'rgba(255, 0, 0, 0.2)';
            makeAdminResult.innerHTML = '<p style="color: #ff6b6b;">Please login first!</p>';
            return;
        }

        try {
            makeAdminResult.style.display = 'block';
            makeAdminResult.style.background = 'rgba(255, 255, 255, 0.1)';
            makeAdminResult.innerHTML = '<p>Making you admin...</p>';

            // Update current user role to admin
            await updateDoc(doc(db, 'users', user.uid), {
                role: 'admin',
                teamRole: 'admin'
            });

            makeAdminResult.style.background = 'rgba(0, 255, 0, 0.2)';
            makeAdminResult.innerHTML = '<p style="color: #4ade80;">Successfully made you an admin!</p>';
            makeAdminResult.innerHTML += '<p style="margin-top: 10px;">Please logout and login again for changes to take effect.</p>';

            console.log('Admin created successfully for:', user.email);

        } catch (error) {
            makeAdminResult.style.background = 'rgba(255, 0, 0, 0.2)';
            makeAdminResult.innerHTML = `<p style="color: #ff6b6b;">Error: ${error.message}</p>`;
            console.error('Error making admin:', error);
        }
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

        // TEMPORARILY DISABLE ADMIN CHECK - allow all logged-in users to access
        // Uncomment this to re-enable admin access check
        /*
        // Check if user has admin role
        if (userData.role !== 'admin' && userData.teamRole !== 'admin') {
            showError('Access denied. Admin privileges required.');
            loading.innerHTML = '<p style="color: #ff6b6b;">Access denied. Admin privileges required.</p>';
            return;
        }
        */

        // User is admin (or temporarily allowed), show admin content
        loading.style.display = 'none';
        adminContent.style.display = 'block';
        loadTeamCodes();
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
