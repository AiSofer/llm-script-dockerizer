const { sanitizeInput, dockerfileExtraction, estimateTokens } = require('../../utils/helpers');

describe('Utility Functions', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sanitizeInput', () => {
        it('should sanitize inputs by removing non-alphanumeric characters', () => {
            const unsanitizedInput = 'my-docker-image#1';
            const sanitizedInput = sanitizeInput(unsanitizedInput);
            expect(sanitizedInput).toBe('my-docker-image1');
        });

        it('should not modify safe characters like alphanumeric, _, -, ., :, /', () => {
            const safeInput = 'my-docker_image-1.0:/path/to/Dockerfile';
            const sanitizedInput = sanitizeInput(safeInput);
            expect(sanitizedInput).toBe(safeInput);
        });
    
        test("should throw a TypeError for non-string input", () => {
            expect(() => sanitizeInput(12345)).toThrow("Input must be a string.");
        });
    });

    describe("dockerfileExtraction", () => {
        test("should throw a TypeError for non-string input", () => {
            expect(() => dockerfileExtraction(12345)).toThrow("Input must be a string.");
        });
    });
    
    describe("estimateTokens", () => {
        test("should estimate tokens accurately for typical text", () => {
            const text = "This is a test sentence.";
            expect(estimateTokens(text)).toBe(6); // 24 characters / 4 ≈ 6 tokens
        });
    
        test("should return 0 tokens for an empty string", () => {
            expect(estimateTokens("")).toBe(0);
        });
    
        test("should throw a TypeError for non-string input", () => {
            expect(() => estimateTokens(12345)).toThrow("Input must be a string.");
        });
    });

});