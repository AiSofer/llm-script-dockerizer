const { exec } = require('child_process');
const path = require('path');
const { buildDockerImage, testDockerImage } = require('../../core/dockerManager'); // Adjust the path as necessary

jest.mock('child_process', () => ({
    exec: jest.fn(),
}));

describe('Docker Utility Functions', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('buildDockerImage', () => {
        it('should call exec with the correct arguments', () => {
            const dockerfilePath = 'Dockerfile';
            const imageName = 'my-docker-image';
            const expectedCommand = `docker build -t my-docker-image -f ${path.resolve(dockerfilePath)} .`;

            buildDockerImage(dockerfilePath, imageName);

            expect(exec).toHaveBeenCalledWith(expectedCommand, expect.any(Function));
        });

        it('should resolve when the Docker build is successful', async () => {
            exec.mockImplementationOnce((command, callback) => callback(null, 'Docker build successful', ''));

            const dockerfilePath = 'Dockerfile';
            const imageName = 'my-docker-image';

            await expect(buildDockerImage(dockerfilePath, imageName)).resolves.toBe('Docker build successful');
        });

        it('should reject when the Docker build fails', async () => {
            exec.mockImplementationOnce((command, callback) => callback(new Error('Docker build error'), '', 'Docker build failed'));

            const dockerfilePath = 'Dockerfile';
            const imageName = 'my-docker-image';

            await expect(buildDockerImage(dockerfilePath, imageName)).rejects.toThrow('Docker build failed. Check Dockerfile and environment.');
        });
    });

    describe('testDockerImage', () => {
        it('should call exec with the correct arguments', () => {
            const imageName = 'my-docker-image';
            const command = 'python script.py';
            const expectedCommand = `docker run --rm my-docker-image python script.py`;

            testDockerImage(imageName, command);

            expect(exec).toHaveBeenCalledWith(expectedCommand, expect.any(Function));
        });

        it('should resolve when the Docker run is successful', async () => {
            exec.mockImplementationOnce((command, callback) => callback(null, 'Docker run successful', ''));

            const imageName = 'my-docker-image';
            const command = 'python script.py';

            await expect(testDockerImage(imageName, command)).resolves.toBe('Docker run successful');
        });

        it('should reject when the Docker run fails', async () => {
            exec.mockImplementationOnce((command, callback) => callback(new Error('Docker run error'), '', 'Docker run failed'));

            const imageName = 'my-docker-image';
            const command = 'python script.py';

            await expect(testDockerImage(imageName, command)).rejects.toThrow('Docker run failed. Check the script or example usage.');
        });
    });
});
