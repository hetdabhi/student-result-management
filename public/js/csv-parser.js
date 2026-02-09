// CSV Parser Module
// Parses CSV files and handles various CSV formats

/**
 * Parse CSV string into array of objects
 * @param {string} csvString - CSV content as string
 * @returns {Array<Object>} Array of result objects
 */
export function parseCSVToObjects(csvString) {
    if (!csvString || csvString.trim() === '') {
        throw new Error('CSV content is empty');
    }

    // Split into lines (handle different line endings)
    const lines = csvString.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length < 2) {
        throw new Error('CSV must contain at least a header row and one data row');
    }

    // Extract headers from first line
    const headers = parseCSVLine(lines[0]);

    if (headers.length === 0) {
        throw new Error('CSV headers are missing');
    }

    // Parse each data line
    const results = [];
    for (let i = 1; i < lines.length; i++) {
        try {
            const values = parseCSVLine(lines[i]);

            // Skip empty lines
            if (values.length === 0 || values.every(v => v === '')) {
                continue;
            }

            // Map values to headers
            const obj = {};
            headers.forEach((header, index) => {
                obj[header.trim()] = values[index] ? values[index].trim() : '';
            });

            results.push(obj);
        } catch (error) {
            throw new Error(`Error parsing line ${i + 1}: ${error.message}`);
        }
    }

    return results;
}

/**
 * Parse a single CSV line handling quotes and commas
 * @param {string} line - Single CSV line
 * @returns {Array<string>} Array of values
 */
export function parseCSVLine(line) {
    const result = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            // Handle escaped quotes ("")
            if (insideQuotes && nextChar === '"') {
                currentValue += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            // End of value
            result.push(currentValue);
            currentValue = '';
        } else {
            // Regular character
            currentValue += char;
        }
    }

    // Add last value
    result.push(currentValue);

    return result;
}

/**
 * Validate CSV structure
 * @param {Array<string>} headers - CSV headers
 * @param {Array<string>} requiredFields - Required field names
 * @returns {Object} Validation result with isValid and missingFields
 */
export function validateCSVStructure(headers, requiredFields) {
    const missingFields = [];

    // Normalize headers for comparison (trim and lowercase)
    const normalizedHeaders = headers.map(h => h.trim().toLowerCase());

    // Check each required field
    for (const field of requiredFields) {
        const normalizedField = field.trim().toLowerCase();
        if (!normalizedHeaders.includes(normalizedField)) {
            missingFields.push(field);
        }
    }

    return {
        isValid: missingFields.length === 0,
        missingFields: missingFields
    };
}

/**
 * Validate result data row
 * @param {Object} row - Parsed CSV row
 * @param {number} rowNumber - Row number for error reporting
 * @returns {Object} Validation result with isValid, errors array
 */
export function validateResultRow(row, rowNumber) {
    const errors = [];

    // Check for required fields
    const requiredFields = ['StudentID', 'Name', 'Email', 'Course', 'Semester'];

    for (const field of requiredFields) {
        // Case-insensitive field check
        const fieldValue = Object.keys(row).find(k => k.toLowerCase() === field.toLowerCase());

        if (!fieldValue || !row[fieldValue] || row[fieldValue].trim() === '') {
            errors.push(`Missing or empty field: ${field}`);
        }
    }

    // Validate email format
    const emailField = Object.keys(row).find(k => k.toLowerCase() === 'email');
    if (emailField && row[emailField]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row[emailField])) {
            errors.push('Invalid email format');
        }
    }

    // Check for at least one subject mark
    const subjectFields = Object.keys(row).filter(key => {
        const lowerKey = key.toLowerCase();
        return !['studentid', 'name', 'email', 'course', 'semester'].includes(lowerKey);
    });

    if (subjectFields.length === 0) {
        errors.push('No subject marks found');
    }

    // Validate subject marks are numbers
    for (const field of subjectFields) {
        const value = row[field];
        if (value && value.trim() !== '') {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                errors.push(`Invalid mark for ${field}: must be a non-negative number`);
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
        rowNumber: rowNumber
    };
}

/**
 * Extract subject marks from parsed row
 * @param {Object} row - Parsed CSV row
 * @returns {Object} Object with subject: mark pairs
 */
export function extractSubjectMarks(row) {
    const subjectMarks = {};
    const excludeFields = ['studentid', 'name', 'email', 'course', 'semester'];

    for (const [key, value] of Object.entries(row)) {
        const lowerKey = key.toLowerCase();
        if (!excludeFields.includes(lowerKey) && value && value.trim() !== '') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                subjectMarks[key] = numValue;
            }
        }
    }

    return subjectMarks;
}
