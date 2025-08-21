// Color utility functions for the colour guessing game

/**
 * Generates a random RGB color
 * @returns {Object} RGB color object with r, g, b properties
 */
function generateRandomColor() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };
}

/**
 * Converts RGB values to hexadecimal format
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color code (#RRGGBB)
 */
function rgbToHex(r, g, b) {
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Converts hexadecimal color to RGB values
 * @param {string} hex - Hex color code (#RRGGBB)
 * @returns {Object|null} RGB object or null if invalid
 */
function hexToRgb(hex) {
    // Remove # if present and validate format
    hex = hex.replace('#', '');
    
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return null;
    }
    
    return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
    };
}

/**
 * Validates if a string is a valid hex color code
 * @param {string} hex - Hex color code to validate
 * @returns {boolean} True if valid hex color
 */
function isValidHex(hex) {
    if (!hex) return false;
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Check if it's exactly 6 characters and all are valid hex digits
    return /^[0-9A-Fa-f]{6}$/.test(hex);
}

/**
 * Formats hex input by adding # if missing and converting to uppercase
 * @param {string} input - User input
 * @returns {string} Formatted hex code
 */
function formatHexInput(input) {
    if (!input) return '';
    
    // Remove any existing #
    let hex = input.replace('#', '');
    
    // Remove any non-hex characters
    hex = hex.replace(/[^0-9A-Fa-f]/g, '');
    
    // Limit to 6 characters
    hex = hex.slice(0, 6);
    
    // Add # prefix and convert to uppercase
    return hex ? '#' + hex.toUpperCase() : '';
}

/**
 * Calculates the Euclidean distance between two RGB colors
 * @param {Object} color1 - First RGB color {r, g, b}
 * @param {Object} color2 - Second RGB color {r, g, b}
 * @returns {number} Distance between colors (0-441.67)
 */
function calculateColorDistance(color1, color2) {
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;
    
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Converts RGB color to CSS color string
 * @param {Object} rgb - RGB color object {r, g, b}
 * @returns {string} CSS rgb() string
 */
function rgbToCss(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Gets a random color optimized for different difficulty levels
 * @param {string} difficulty - 'easy', 'medium', 'hard', or 'expert'
 * @returns {Object} RGB color object
 */
function generateColorByDifficulty(difficulty = 'medium') {
    switch (difficulty) {
        case 'easy':
            // Generate colors with values that are multiples of 17 (easier to guess)
            return {
                r: Math.floor(Math.random() * 16) * 17,
                g: Math.floor(Math.random() * 16) * 17,
                b: Math.floor(Math.random() * 16) * 17
            };
        
        case 'medium':
            return generateRandomColor();
        
        case 'hard':
            // Generate more subtle colors (avoiding very bright or very dark)
            return {
                r: Math.floor(Math.random() * 128) + 64,
                g: Math.floor(Math.random() * 128) + 64,
                b: Math.floor(Math.random() * 128) + 64
            };
        
        case 'expert':
            // Generate very similar colors to previous (would need game state)
            return generateRandomColor();
        
        default:
            return generateRandomColor();
    }
}
