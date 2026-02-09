// Student Dashboard Controller
// Handles fetching and displaying student results

import { auth } from '../firebase-config.js';
import { onAuthStateChanged, getUserRole, signOut } from '../auth.js';
import { getResultsByStudentUID, getUserProfile } from '../firestore-service.js';
import { formatMarks } from '../calculations.js';

// DOM Elements
let studentName, studentId, studentEmail;
let logoutBtn, refreshBtn;
let loadingIndicator, emptyState, resultsContainer;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    studentName = document.getElementById('studentName');
    studentId = document.getElementById('studentId');
    studentEmail = document.getElementById('studentEmail');
    logoutBtn = document.getElementById('logoutBtn');
    refreshBtn = document.getElementById('refreshBtn');
    loadingIndicator = document.getElementById('loadingIndicator');
    emptyState = document.getElementById('emptyState');
    resultsContainer = document.getElementById('resultsContainer');

    // Check authentication
    checkAuth();

    // Set up event listeners
    setupEventListeners();
});

/**
 * Check if user is authenticated and is student
 */
function checkAuth() {
    onAuthStateChanged(async (user) => {
        if (!user) {
            // Not authenticated, redirect to login
            window.location.href = '/index.html';
            return;
        }

        // Check if user is student
        const role = await getUserRole(user);

        if (role === 'admin') {
            // Admin user, redirect to admin dashboard
            window.location.href = '/admin/dashboard.html';
            return;
        }

        // Load student data
        await loadStudentData(user);
    });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Logout button
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to logout. Please try again.');
        }
    });

    // Refresh button
    refreshBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (user) {
            await loadStudentData(user);
        }
    });
}

/**
 * Load student data and results
 * @param {Object} user - Firebase user object
 */
async function loadStudentData(user) {
    try {
        // Show loading
        showLoading(true);

        // Get user profile
        const profile = await getUserProfile(user.uid);

        // Display student info
        if (profile) {
            studentName.textContent = profile.name || 'N/A';
            studentId.textContent = profile.studentId || 'N/A';
            studentEmail.textContent = profile.email || user.email;
        } else {
            studentName.textContent = 'N/A';
            studentId.textContent = 'N/A';
            studentEmail.textContent = user.email;
        }

        // Fetch student results
        const results = await fetchStudentResults(user.uid);

        // Hide loading
        showLoading(false);

        // Display results
        if (results.length === 0) {
            showEmptyState(true);
            showResults(false);
        } else {
            showEmptyState(false);
            showResults(true);
            renderResultsTable(results);
        }

    } catch (error) {
        console.error('Error loading student data:', error);
        showLoading(false);
        showEmptyState(true);
        showResults(false);
        alert('Failed to load data. Please try again.');
    }
}

/**
 * Fetch student's results from Firestore
 * @param {string} studentUID - Student's Firebase Auth UID
 * @returns {Promise<Array>} Array of result objects
 */
async function fetchStudentResults(studentUID) {
    try {
        const results = await getResultsByStudentUID(studentUID);
        return results;
    } catch (error) {
        console.error('Error fetching results:', error);
        throw error;
    }
}

/**
 * Render results in table format
 * @param {Array} results - Array of result objects
 */
function renderResultsTable(results) {
    // Clear existing content
    resultsContainer.innerHTML = '';

    // Sort results by semester (most recent first)
    const sortedResults = results.sort((a, b) => {
        // Simple string comparison for semester
        return b.semester.localeCompare(a.semester);
    });

    // Create result cards
    sortedResults.forEach(result => {
        const resultCard = createResultCard(result);
        resultsContainer.appendChild(resultCard);
    });
}

/**
 * Create a result card element
 * @param {Object} result - Result object
 * @returns {HTMLElement} Result card element
 */
function createResultCard(result) {
    const card = document.createElement('div');
    card.className = 'result-card';

    // Format result for display
    const formattedResult = formatResultForDisplay(result);

    // Create card HTML
    card.innerHTML = `
        <div class="result-header">
            <div>
                <div class="result-title">${formattedResult.course}</div>
                <div class="result-semester">${formattedResult.semester}</div>
            </div>
            <span class="result-status ${formattedResult.statusClass}">${formattedResult.resultStatus}</span>
        </div>
        <div class="result-body">
            <table class="subjects-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                    </tr>
                </thead>
                <tbody>
                    ${formattedResult.subjectsHTML}
                </tbody>
            </table>
            <div class="result-total">
                <span class="total-label">Total Marks:</span>
                <span class="total-value">${formattedResult.totalMarks}</span>
            </div>
        </div>
    `;

    return card;
}

/**
 * Format result data for display
 * @param {Object} result - Result object
 * @returns {Object} Formatted result object
 */
function formatResultForDisplay(result) {
    // Format subject marks as HTML rows
    const subjectsHTML = Object.entries(result.subjectMarks || {})
        .map(([subject, marks]) => `
            <tr>
                <td>${subject}</td>
                <td>${formatMarks(marks)}</td>
            </tr>
        `)
        .join('');

    // Determine status class
    const statusClass = result.resultStatus === 'Pass' ? 'pass' : 'fail';

    return {
        course: result.course || 'N/A',
        semester: result.semester || 'N/A',
        resultStatus: result.resultStatus || 'N/A',
        statusClass: statusClass,
        subjectsHTML: subjectsHTML || '<tr><td colspan="2">No subjects</td></tr>',
        totalMarks: formatMarks(result.totalMarks || 0)
    };
}

/**
 * Show/hide loading indicator
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
    loadingIndicator.style.display = show ? 'block' : 'none';
}

/**
 * Show/hide empty state
 * @param {boolean} show - Whether to show empty state
 */
function showEmptyState(show) {
    emptyState.style.display = show ? 'block' : 'none';
}

/**
 * Show/hide results container
 * @param {boolean} show - Whether to show results
 */
function showResults(show) {
    resultsContainer.style.display = show ? 'block' : 'none';
}
