/**
 * Script to set admin custom claims in Firebase Authentication
 * 
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console:
 *    Project Settings > Service Accounts > Generate New Private Key
 * 3. Save the key as serviceAccountKey.json in the scripts folder
 * 
 * Usage:
 * node scripts/set-admin-claims.js admin@institute.edu
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
try {
    const serviceAccount = require('./serviceAccountKey.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:');
    console.error('Make sure serviceAccountKey.json exists in the scripts folder');
    console.error(error.message);
    process.exit(1);
}

/**
 * Set admin custom claim for a user
 * @param {string} email - User email
 */
async function setAdminClaim(email) {
    try {
        // Get user by email
        const user = await admin.auth().getUserByEmail(email);
        console.log(`Found user: ${user.email} (UID: ${user.uid})`);

        // Set custom claims
        await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
        console.log(`✓ Admin claim set successfully for ${email}`);
        console.log('Note: User must logout and login again for changes to take effect');

        // Verify claims were set
        const updatedUser = await admin.auth().getUser(user.uid);
        console.log('Custom claims:', updatedUser.customClaims);

    } catch (error) {
        console.error(`Error setting admin claim for ${email}:`);
        console.error(error.message);
        throw error;
    }
}

/**
 * Set student custom claim for a user
 * @param {string} email - User email
 */
async function setStudentClaim(email) {
    try {
        // Get user by email
        const user = await admin.auth().getUserByEmail(email);
        console.log(`Found user: ${user.email} (UID: ${user.uid})`);

        // Set custom claims
        await admin.auth().setCustomUserClaims(user.uid, { role: 'student' });
        console.log(`✓ Student claim set successfully for ${email}`);

    } catch (error) {
        console.error(`Error setting student claim for ${email}:`);
        console.error(error.message);
        throw error;
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node set-admin-claims.js <email> [role]');
    console.log('Example: node set-admin-claims.js admin@institute.edu admin');
    console.log('Example: node set-admin-claims.js student@example.com student');
    process.exit(1);
}

const email = args[0];
const role = args[1] || 'admin';

if (role === 'admin') {
    setAdminClaim(email)
        .then(() => {
            console.log('\nDone!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\nFailed!');
            process.exit(1);
        });
} else if (role === 'student') {
    setStudentClaim(email)
        .then(() => {
            console.log('\nDone!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\nFailed!');
            process.exit(1);
        });
} else {
    console.error('Invalid role. Use "admin" or "student"');
    process.exit(1);
}
