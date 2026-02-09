// Authentication Service
// Handles user login, role identification, and session management

import { auth } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} UserCredential object or throws error
 */
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        // Map Firebase error codes to user-friendly messages
        let errorMessage = 'An error occurred during login';

        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled';
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                // Don't reveal whether email exists (security best practice)
                errorMessage = 'Invalid email or password';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Unable to connect. Please check your internet connection';
                break;
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password';
                break;
            default:
                errorMessage = 'Login failed. Please try again';
        }

        throw new Error(errorMessage);
    }
}

/**
 * Get user role from custom claims
 * @param {Object} user - Firebase User object
 * @returns {Promise<string>} Role ("admin" or "student")
 */
export async function getUserRole(user) {
    try {
        if (!user) {
            return 'student'; // Default role
        }

        // Get ID token result with custom claims
        const idTokenResult = await user.getIdTokenResult();

        // Extract role from custom claims
        const role = idTokenResult.claims.role;

        // Return role or default to "student"
        return role || 'student';
    } catch (error) {
        console.error('Error getting user role:', error);
        return 'student'; // Default to student on error
    }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function signOut() {
    try {
        await firebaseSignOut(auth);
        // Clear any local session data
        sessionStorage.clear();
        localStorage.removeItem('userRole');
        // Redirect to login page
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Error signing out:', error);
        throw new Error('Failed to sign out. Please try again');
    }
}

/**
 * Monitor authentication state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} Unsubscribe function
 */
export function onAuthStateChanged(callback) {
    return firebaseOnAuthStateChanged(auth, callback);
}

/**
 * Get current authenticated user
 * @returns {Object|null} Current user or null
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export function isAuthenticated() {
    return auth.currentUser !== null;
}
