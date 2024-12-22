// Utility to sanitize inputs for shell commands
function sanitizeInput(input) {
    return input.replace(/[^a-zA-Z0-9_\-.:/ ']/g, '');
}

// Dockerfile extraction from text
function dockerfileExtraction(input) {
    return input.substring(input.indexOf("FROM"), input.length-3);
}

// Estimate tokens based on the length of the text
function estimateTokens(text) {
    return Math.ceil(text.length / 4); // Approximation: 1 token ≈ 4 characters
}

module.exports = { sanitizeInput, dockerfileExtraction, estimateTokens };