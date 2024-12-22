const VALID_DOCKERFILE_START = "FROM";

/**
 * Utility to sanitize inputs for shell commands.
 * Removes characters not matching the allowed set.
 * @param {string} input - The input string to sanitize.
 * @returns {string} - The sanitized input string.
 */
function sanitizeInput(input) {
    if (typeof input !== "string") {
        throw new TypeError("Input must be a string.");
    }

    return input.replace(/[^a-zA-Z0-9_\-.:/ ']/g, '');
}

/**
 * Extracts the Dockerfile content from a given text input.
 * @param {string} input - The input string containing the Dockerfile text.
 * @returns {string} - The extracted Dockerfile content.
 * @throws {Error} - If the input does not contain a valid Dockerfile start.
 */
function dockerfileExtraction(input) {
    if (typeof input !== "string") {
        throw new TypeError("Input must be a string.");
    }

    const startIndex = input.indexOf(VALID_DOCKERFILE_START);

    if (startIndex === -1) {
        throw new Error(`No valid Dockerfile content found starting with "${VALID_DOCKERFILE_START}".`);
    }

    return input.substring(startIndex, input.length-3);
}

/**
 * Estimates the number of tokens based on the length of the input text.
 * Assumes approximately 1 token per 4 characters.
 * @param {string} text - The input text.
 * @returns {number} - The estimated number of tokens.
 * @throws {TypeError} - If the input is not a string.
 */
function estimateTokens(text) {
    if (typeof text !== "string") {
        throw new TypeError("Input must be a string.");
    }

    return Math.ceil(text.length / 4);
}

module.exports = { sanitizeInput, dockerfileExtraction, estimateTokens };