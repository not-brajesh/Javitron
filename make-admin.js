// Temporary script to make Brajesh Kumar an admin
// Run this script once, then delete it

import { app, auth, db } from "./firebase-config.js";
import {
    getDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function makeAdmin() {
    const email = 'kbrajesh5688@gmail.com';
    const name = 'Brajesh Kumar';

    try {
        console.log(`Searching for user with email: ${email}`);

        // Query users collection to find the user by email
        const usersSnapshot = await getDocs(collection(db, 'users'));

        let userDoc = null;
        let userId = null;

        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.email === email) {
                userDoc = doc;
                userId = doc.id;
                console.log(`Found user: ${userData.name} (${userData.email}) with ID: ${userId}`);
            }
        });

        if (!userDoc) {
            console.error('User not found with email:', email);
            return;
        }

        // Update user role to admin
        await updateDoc(doc(db, 'users', userId), {
            role: 'admin',
            teamRole: 'admin'
        });

        console.log(`Successfully made ${name} (${email}) an admin!`);
        console.log('You can now delete this file (make-admin.js)');

    } catch (error) {
        console.error('Error making admin:', error);
    }
}

// Import getDocs
import {
    getDocs,
    collection
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

makeAdmin();
