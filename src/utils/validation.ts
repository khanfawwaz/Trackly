/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Empty URL is valid (optional field)
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate required field
 */
export const isRequired = (value: string): boolean => {
    return value.trim().length > 0;
};

/**
 * Validate password strength (minimum 6 characters)
 */
export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};
