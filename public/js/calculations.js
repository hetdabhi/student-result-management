// Result Calculation and Validation Logic
// Handles total marks calculation, pass/fail determination, and data validation

// Default passing threshold (can be configured)
const DEFAULT_PASSING_THRESHOLD = 40; // 40% of total marks
const DEFAULT_PASSING_PERCENTAGE = 40;

/**
 * Calculate total marks from subject-wise marks
 * @param {Object} subjectMarks - Object with subject: mark pairs
 * @returns {number} Total marks
 */
export function calculateTotal(subjectMarks) {
    if (!subjectMarks || typeof subjectMarks !== 'object') {
        return 0;
    }

    let total = 0;

    for (const mark of Object.values(subjectMarks)) {
        const numMark = parseFloat(mark);
        if (!isNaN(numMark) && numMark >= 0) {
            total += numMark;
        }
    }

    return total;
}

/**
 * Determine pass/fail status based on total marks
 * @param {number} total - Total marks
 * @param {number} passingThreshold - Minimum marks to pass (optional)
 * @returns {string} "Pass" or "Fail"
 */
export function determineStatus(total, passingThreshold = null) {
    // If no threshold provided, use percentage-based calculation
    // Assuming each subject is out of 100
    if (passingThreshold === null) {
        // For percentage-based: if average is >= 40%, pass
        // This is a simplified approach
        return total >= DEFAULT_PASSING_THRESHOLD ? 'Pass' : 'Fail';
    }

    return total >= passingThreshold ? 'Pass' : 'Fail';
}

/**
 * Calculate passing threshold based on number of subjects
 * @param {number} subjectCount - Number of subjects
 * @param {number} passingPercentage - Passing percentage (default 40%)
 * @returns {number} Passing threshold
 */
export function calculatePassingThreshold(subjectCount, passingPercentage = DEFAULT_PASSING_PERCENTAGE) {
    // Assuming each subject is out of 100
    const maxMarks = subjectCount * 100;
    return (maxMarks * passingPercentage) / 100;
}

/**
 * Determine status with percentage-based calculation
 * @param {Object} subjectMarks - Object with subject: mark pairs
 * @param {number} passingPercentage - Passing percentage (default 40%)
 * @returns {string} "Pass" or "Fail"
 */
export function determineStatusByPercentage(subjectMarks, passingPercentage = DEFAULT_PASSING_PERCENTAGE) {
    const subjectCount = Object.keys(subjectMarks).length;

    if (subjectCount === 0) {
        return 'Fail';
    }

    const total = calculateTotal(subjectMarks);
    const threshold = calculatePassingThreshold(subjectCount, passingPercentage);

    return determineStatus(total, threshold);
}

/**
 * Validate result data structure
 * @param {Object} resultData - Result data object
 * @returns {Object} Validation result with isValid and errors array
 */
export function validateResultData(resultData) {
    const errors = [];

    // Check required fields
    const requiredFields = [
        'studentUID',
        'studentId',
        'studentName',
        'course',
        'semester',
        'subjectMarks'
    ];

    for (const field of requiredFields) {
        if (!resultData[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    // Validate studentUID format
    if (resultData.studentUID && typeof resultData.studentUID !== 'string') {
        errors.push('studentUID must be a string');
    }

    // Validate studentId
    if (resultData.studentId && typeof resultData.studentId !== 'string') {
        errors.push('studentId must be a string');
    }

    // Validate studentName
    if (resultData.studentName && typeof resultData.studentName !== 'string') {
        errors.push('studentName must be a string');
    }

    // Validate course
    if (resultData.course && typeof resultData.course !== 'string') {
        errors.push('course must be a string');
    }

    // Validate semester
    if (resultData.semester && typeof resultData.semester !== 'string') {
        errors.push('semester must be a string');
    }

    // Validate subjectMarks
    if (resultData.subjectMarks) {
        if (typeof resultData.subjectMarks !== 'object' || Array.isArray(resultData.subjectMarks)) {
            errors.push('subjectMarks must be an object');
        } else {
            // Check if at least one subject exists
            const subjects = Object.keys(resultData.subjectMarks);
            if (subjects.length === 0) {
                errors.push('subjectMarks must contain at least one subject');
            }

            // Validate each mark
            for (const [subject, mark] of Object.entries(resultData.subjectMarks)) {
                const numMark = parseFloat(mark);
                if (isNaN(numMark)) {
                    errors.push(`Invalid mark for ${subject}: must be a number`);
                } else if (numMark < 0) {
                    errors.push(`Invalid mark for ${subject}: must be non-negative`);
                } else if (numMark > 100) {
                    errors.push(`Invalid mark for ${subject}: must not exceed 100`);
                }
            }
        }
    }

    // Validate totalMarks if provided
    if (resultData.totalMarks !== undefined) {
        const numTotal = parseFloat(resultData.totalMarks);
        if (isNaN(numTotal) || numTotal < 0) {
            errors.push('totalMarks must be a non-negative number');
        }
    }

    // Validate resultStatus if provided
    if (resultData.resultStatus && !['Pass', 'Fail'].includes(resultData.resultStatus)) {
        errors.push('resultStatus must be either "Pass" or "Fail"');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Calculate percentage from total marks and subject count
 * @param {number} totalMarks - Total marks obtained
 * @param {number} subjectCount - Number of subjects
 * @returns {number} Percentage (0-100)
 */
export function calculatePercentage(totalMarks, subjectCount) {
    if (subjectCount === 0) {
        return 0;
    }

    const maxMarks = subjectCount * 100;
    return (totalMarks / maxMarks) * 100;
}

/**
 * Format marks for display
 * @param {number} marks - Marks value
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} Formatted marks
 */
export function formatMarks(marks, decimals = 2) {
    const numMarks = parseFloat(marks);
    if (isNaN(numMarks)) {
        return '0.00';
    }
    return numMarks.toFixed(decimals);
}
