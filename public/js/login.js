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
    const togglePasswordBtn = document.getElementById('togglePassword');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle eye icon (add slash when showing password)
        const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
        if (type === 'text') {
            eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
        } else {
            eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        }
    });

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
