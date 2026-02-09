// Firestore Data Access Layer
// Abstracts Firestore operations and provides consistent data access interface

import { db } from './firebase-config.js';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    getDocs,
    getDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

/**
 * Add a new result document
 * @param {Object} resultData - Result data object
 * @returns {Promise<string>} Document ID
 */
export async function addResult(resultData) {
    try {
        // Validate result data structure
        if (!resultData.studentUID) {
            throw new Error('studentUID is required');
        }

        // Add timestamps
        const dataWithTimestamps = {
            ...resultData,
            uploadedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Add document to results collection
        const docRef = await addDoc(collection(db, 'results'), dataWithTimestamps);

        return docRef.id;
    } catch (error) {
        console.error('Error adding result:', error);
        throw new Error(`Failed to add result: ${error.message}`);
    }
}

/**
 * Update existing result document
 * @param {string} documentId - Document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<boolean>} Success status
 */
export async function updateResult(documentId, updates) {
    try {
        // Add updated timestamp
        const updatesWithTimestamp = {
            ...updates,
            updatedAt: serverTimestamp()
        };

        // Update document in results collection
        const docRef = doc(db, 'results', documentId);
        await updateDoc(docRef, updatesWithTimestamp);

        return true;
    } catch (error) {
        console.error('Error updating result:', error);
        throw new Error(`Failed to update result: ${error.message}`);
    }
}

/**
 * Query results by Student UID
 * @param {string} studentUID - Student's Firebase Auth UID
 * @returns {Promise<Array>} Array of result documents
 */
export async function getResultsByStudentUID(studentUID) {
    try {
        const resultsRef = collection(db, 'results');
        const q = query(resultsRef, where('studentUID', '==', studentUID));

        const querySnapshot = await getDocs(q);
        const results = [];

        querySnapshot.forEach((doc) => {
            results.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return results;
    } catch (error) {
        console.error('Error fetching results:', error);
        throw new Error(`Failed to fetch results: ${error.message}`);
    }
}

/**
 * Get user profile from users collection
 * @param {string} uid - User's Firebase Auth UID
 * @returns {Promise<Object|null>} User profile or null
 */
export async function getUserProfile(uid) {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                uid: docSnap.id,
                ...docSnap.data()
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
}

/**
 * Look up Student UID by email
 * @param {string} email - Student email
 * @returns {Promise<string|null>} Student UID or null
 */
export async function lookupStudentUIDByEmail(email) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email.toLowerCase()));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        // Return first matching user's UID
        return querySnapshot.docs[0].id;
    } catch (error) {
        console.error('Error looking up student by email:', error);
        throw new Error(`Failed to lookup student: ${error.message}`);
    }
}

/**
 * Look up Student UID by student ID
 * @param {string} studentId - Student ID
 * @returns {Promise<string|null>} Student UID or null
 */
export async function lookupStudentUIDByStudentId(studentId) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('studentId', '==', studentId));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        // Return first matching user's UID
        return querySnapshot.docs[0].id;
    } catch (error) {
        console.error('Error looking up student by ID:', error);
        throw new Error(`Failed to lookup student: ${error.message}`);
    }
}

/**
 * Look up Student UID from email or student ID
 * @param {string} email - Student email
 * @param {string} studentId - Student ID
 * @returns {Promise<string|null>} Student UID or null
 */
export async function lookupStudentUID(email, studentId) {
    // Try email first
    if (email) {
        const uidByEmail = await lookupStudentUIDByEmail(email);
        if (uidByEmail) {
            return uidByEmail;
        }
    }

    // Try student ID
    if (studentId) {
        const uidByStudentId = await lookupStudentUIDByStudentId(studentId);
        if (uidByStudentId) {
            return uidByStudentId;
        }
    }

    return null;
}

/**
 * Check if a result exists for a student in a specific semester
 * @param {string} studentUID - Student UID
 * @param {string} course - Course name
 * @param {string} semester - Semester
 * @returns {Promise<Object|null>} Existing result or null
 */
export async function findExistingResult(studentUID, course, semester) {
    try {
        const resultsRef = collection(db, 'results');
        const q = query(
            resultsRef,
            where('studentUID', '==', studentUID),
            where('course', '==', course),
            where('semester', '==', semester)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        // Return first matching result
        const doc = querySnapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Error finding existing result:', error);
        return null;
    }
}
