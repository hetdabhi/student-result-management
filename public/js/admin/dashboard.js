// Admin Dashboard Controller
// Handles file upload, result storage, and dashboard functionality

import { auth } from '../firebase-config.js';
import { onAuthStateChanged, getUserRole, signOut } from '../auth.js';
import { parseCSVToObjects, validateResultRow, extractSubjectMarks } from '../csv-parser.js';
import {
    addResult,
    updateResult,
    lookupStudentUID,
    findExistingResult
} from '../firestore-service.js';
import {
    calculateTotal,
    determineStatusByPercentage,
    validateResultData
} from '../calculations.js';

// DOM Elements
let csvFileInput, uploadArea, browseBtn, logoutBtn;
let uploadProgress, progressFill, progressText;
let messageContainer, resultsTableBody;
let adminName, refreshBtn, downloadTemplateBtn;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    csvFileInput = document.getElementById('csvFileInput');
    uploadArea = document.getElementById('uploadArea');
    browseBtn = document.getElementById('browseBtn');
    logoutBtn = document.getElementById('logoutBtn');
    uploadProgress = document.getElementById('uploadProgress');
    progressFill = document.getElementById('progressFill');
    progressText = document.getElementById('progressText');
    messageContainer = document.getElementById('messageContainer');
    resultsTableBody = document.getElementById('resultsTableBody');
    adminName = document.getElementById('adminName');
    refreshBtn = document.getElementById('refreshBtn');
    downloadTemplateBtn = document.getElementById('downloadTemplateBtn');

    // Check authentication
    checkAuth();

    // Set up event listeners
    setupEventListeners();
});

/**
 * Check if user is authenticated and is admin
 */
function checkAuth() {
    onAuthStateChanged(async (user) => {
        if (!user) {
            // Not authenticated, redirect to login
            window.location.href = '/index.html';
            return;
        }

        // Check if user is admin
        const role = await getUserRole(user);

        if (role !== 'admin') {
            // Not admin, redirect to student dashboard
            window.location.href = '/student/dashboard.html';
            return;
        }

        // Display admin name
        adminName.textContent = user.email || 'Admin';
    });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Browse button
    browseBtn.addEventListener('click', () => {
        csvFileInput.click();
    });

    // Upload area click
    uploadArea.addEventListener('click', () => {
        csvFileInput.click();
    });

    // File input change
    csvFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.csv')) {
            handleFileUpload(file);
        } else {
            showMessage('Please upload a CSV file', 'error');
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut();
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    // Refresh button
    refreshBtn.addEventListener('click', () => {
        showMessage('Refresh functionality coming soon', 'warning');
    });

    // Download template button
    downloadTemplateBtn.addEventListener('click', downloadTemplate);
}

/**
 * Handle CSV file upload
 * @param {File} file - CSV file
 */
async function handleFileUpload(file) {
    // Validate file type
    if (!file.name.endsWith('.csv')) {
        showMessage('Please upload a CSV file', 'error');
        return;
    }

    // Clear previous messages
    messageContainer.innerHTML = '';

    // Show progress
    showProgress(true);
    updateProgress(0, 'Reading file...');

    try {
        // Read file content
        const csvContent = await readFileContent(file);
        updateProgress(20, 'Parsing CSV...');

        // Parse CSV
        const rows = parseCSVToObjects(csvContent);
        updateProgress(40, `Processing ${rows.length} records...`);

        // Process each row
        const results = await processRows(rows);

        // Display results
        displayUploadResults(results);

        // Hide progress
        showProgress(false);

        // Reset file input
        csvFileInput.value = '';

    } catch (error) {
        console.error('Upload error:', error);
        showMessage(`Upload failed: ${error.message}`, 'error');
        showProgress(false);
    }
}

/**
 * Read file content
 * @param {File} file - File to read
 * @returns {Promise<string>} File content
 */
function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            resolve(e.target.result);
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
}

/**
 * Process CSV rows
 * @param {Array} rows - Parsed CSV rows
 * @returns {Promise<Object>} Processing results
 */
async function processRows(rows) {
    const results = {
        success: 0,
        failed: 0,
        errors: []
    };

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2; // +2 because of header and 0-index

        try {
            // Validate row
            const validation = validateResultRow(row, rowNumber);

            if (!validation.isValid) {
                results.failed++;
                results.errors.push(`Row ${rowNumber}: ${validation.errors.join(', ')}`);
                continue;
            }

            // Store result
            await storeResult(row);
            results.success++;

            // Update progress
            const progress = 40 + ((i + 1) / rows.length) * 60;
            updateProgress(progress, `Processed ${i + 1} of ${rows.length} records...`);

        } catch (error) {
            results.failed++;
            results.errors.push(`Row ${rowNumber}: ${error.message}`);
        }
    }

    return results;
}

/**
 * Store result in Firestore
 * @param {Object} row - CSV row data
 */
async function storeResult(row) {
    // Extract fields (case-insensitive)
    const getField = (fieldName) => {
        const key = Object.keys(row).find(k => k.toLowerCase() === fieldName.toLowerCase());
        return key ? row[key] : '';
    };

    const studentId = getField('StudentID');
    const name = getField('Name');
    const email = getField('Email');
    const course = getField('Course');
    const semester = getField('Semester');

    // Look up Student UID
    const studentUID = await lookupStudentUID(email, studentId);

    if (!studentUID) {
        throw new Error(`Student not found: ${email || studentId}`);
    }

    // Extract subject marks
    const subjectMarks = extractSubjectMarks(row);

    // Calculate total and status
    const totalMarks = calculateTotal(subjectMarks);
    const resultStatus = determineStatusByPercentage(subjectMarks);

    // Create result data
    const resultData = {
        studentUID,
        studentId,
        studentName: name,
        course,
        semester,
        subjectMarks,
        totalMarks,
        resultStatus
    };

    // Validate result data
    const validation = validateResultData(resultData);
    if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
    }

    // Check if result already exists
    const existingResult = await findExistingResult(studentUID, course, semester);

    if (existingResult) {
        // Update existing result
        await updateResult(existingResult.id, {
            subjectMarks,
            totalMarks,
            resultStatus
        });
    } else {
        // Add new result
        await addResult(resultData);
    }
}

/**
 * Display upload results
 * @param {Object} results - Upload results
 */
function displayUploadResults(results) {
    const { success, failed, errors } = results;

    // Success message
    if (success > 0) {
        showMessage(`Successfully uploaded ${success} record(s)`, 'success');
    }

    // Error messages
    if (failed > 0) {
        const errorMsg = `Failed to upload ${failed} record(s)`;
        showMessage(errorMsg, 'error');

        // Show first few errors
        const maxErrors = 5;
        const displayErrors = errors.slice(0, maxErrors);
        displayErrors.forEach(error => {
            showMessage(error, 'warning');
        });

        if (errors.length > maxErrors) {
            showMessage(`... and ${errors.length - maxErrors} more errors`, 'warning');
        }
    }
}

/**
 * Show/hide progress indicator
 * @param {boolean} show - Whether to show progress
 */
function showProgress(show) {
    uploadProgress.style.display = show ? 'block' : 'none';
}

/**
 * Update progress bar
 * @param {number} percent - Progress percentage (0-100)
 * @param {string} text - Progress text
 */
function updateProgress(percent, text) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = text;
}

/**
 * Show message to user
 * @param {string} message - Message text
 * @param {string} type - Message type (success, error, warning)
 */
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
}

/**
 * Download CSV template
 */
function downloadTemplate() {
    const template = 'StudentID,Name,Email,Course,Semester,Math,Physics,Chemistry,English,Biology\n' +
        'S001,John Doe,john@example.com,Computer Science,Fall 2024,85,90,78,88,92\n' +
        'S002,Jane Smith,jane@example.com,Computer Science,Fall 2024,92,88,95,90,87';

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_results_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
