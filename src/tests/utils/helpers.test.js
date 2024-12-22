const { sanitizeInput } = require('../../utils/helpers');

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
    });

});