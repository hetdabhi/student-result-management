// Router Module
// Handles route protection and role-based access control

import { auth } from './firebase-config.js';
import { onAuthStateChanged, getUserRole } from './auth.js';

/**
 * Route configuration
 */
const routes = {
    login: '/index.html',
    admin: '/admin/dashboard.html',
    student: '/student/dashboard.html'
};

/**
 * Get current page type
 * @returns {string} Page type (login, admin, student, or unknown)
 */
function getCurrentPageType() {
    const path = window.location.pathname;

    if (path.includes('/admin/')) {
        return 'admin';
    } else if (path.includes('/student/')) {
        return 'student';
    } else if (path.includes('index.html') || path === '/') {
        return 'login';
    }

    return 'unknown';
}

/**
 * Redirect to appropriate page based on role
 * @param {string} role - User role (admin or student)
 */
function redirectByRole(role) {
    const currentPage = getCurrentPageType();

    if (role === 'admin') {
        // Admin should be on admin dashboard
        if (currentPage !== 'admin') {
            window.location.href = routes.admin;
        }
    } else {
        // Student should be on student dashboard
        if (currentPage !== 'student') {
            window.location.href = routes.student;
        }
    }
}

/**
 * Redirect to login page
 */
function redirectToLogin() {
    const currentPage = getCurrentPageType();

    if (currentPage !== 'login') {
        window.location.href = routes.login;
    }
}

/**
 * Protect route - ensure user is authenticated and has correct role
 * @param {string} requiredRole - Required role for this route (admin or student)
 */
export function protectRoute(requiredRole) {
    onAuthStateChanged(async (user) => {
        if (!user) {
            // Not authenticated, redirect to login
            redirectToLogin();
            return;
        }

        // Get user role
        const role = await getUserRole(user);

        // Check if user has required role
        if (role !== requiredRole) {
            // Wrong role, redirect to appropriate dashboard
            redirectByRole(role);
        }
    });
}

/**
 * Check authentication and redirect if needed
 * This is used on the login page to redirect already authenticated users
 */
export function checkAuthAndRedirect() {
    onAuthStateChanged(async (user) => {
        if (user) {
            // User is authenticated, redirect to appropriate dashboard
            const role = await getUserRole(user);
            redirectByRole(role);
        }
    });
}

/**
 * Initialize router for current page
 * Automatically protects routes based on current page
 */
export function initRouter() {
    const currentPage = getCurrentPageType();

    switch (currentPage) {
        case 'admin':
            protectRoute('admin');
            break;
        case 'student':
            protectRoute('student');
            break;
        case 'login':
            checkAuthAndRedirect();
            break;
        default:
            // Unknown page, do nothing
            break;
    }
}

// Auto-initialize router when module is loaded
// This ensures route protection is always active
if (typeof window !== 'undefined') {
    // Only run in browser environment
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to ensure Firebase is initialized
        setTimeout(initRouter, 100);
    });
}
