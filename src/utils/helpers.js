// Utility to sanitize inputs for shell commands
function sanitizeInput(input) {
    return input.replace(/[^a-zA-Z0-9_\-.:/ ']/g, '');
}

// Dockerfile extraction from text
function dockerfileExtraction(input) {
    return input.substring(input.indexOf("FROM"), input.length-3);
}

module.exports = { sanitizeInput, dockerfileExtraction };