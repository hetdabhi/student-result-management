// Login Page Logic
// Handles form submission, authentication, and redirection

import { signIn, getUserRole } from './auth.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.getElementById('loginBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous error messages
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';

        // Get form values
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Basic validation
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Attempt to sign in
            const userCredential = await signIn(email, password);
            const user = userCredential.user;

            // Get user role
            const role = await getUserRole(user);

            // Store role in session storage for quick access
            sessionStorage.setItem('userRole', role);

            // Redirect to appropriate dashboard based on role
            if (role === 'admin') {
                window.location.href = '/admin/dashboard.html';
            } else {
                window.location.href = '/student/dashboard.html';
            }

        } catch (error) {
            // Display error message
            showError(error.message);
            setLoadingState(false);
        }
    });

    /**
     * Display error message to user
     * @param {string} message - Error message to display
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    /**
     * Set loading state for form
     * @param {boolean} isLoading - Whether form is in loading state
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            loadingSpinner.style.display = 'inline-block';
            emailInput.disabled = true;
            passwordInput.disabled = true;
        } else {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
            loadingSpinner.style.display = 'none';
            emailInput.disabled = false;
            passwordInput.disabled = false;
        }
    }
});
