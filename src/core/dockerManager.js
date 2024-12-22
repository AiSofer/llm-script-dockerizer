const { exec } = require('child_process');
const path = require('path');
const { sanitizeInput } = require('../utils/helpers');

function buildDockerImage(dockerfilePath, imageName) {
    const sanitizedImageName = sanitizeInput(imageName);
    const sanitizedDockerfilePath = sanitizeInput(path.resolve(dockerfilePath));

    return new Promise((resolve, reject) => {
        exec(
            `docker build -t ${sanitizedImageName} -f ${sanitizedDockerfilePath} .`,
            (err, stdout, stderr) => {
                if (err) {
                    console.error('Docker build error:', stderr);
                    reject(new Error('Docker build failed. Check Dockerfile and environment.'));
                } else {
                    console.log('Docker build output:', stdout);
                    resolve(stdout);
                }
            }
        );
    });
}

function testDockerImage(imageName, command) {
    const sanitizedImageName = sanitizeInput(imageName);
    const sanitizedCommand = sanitizeInput(command);


    return new Promise((resolve, reject) => {
        exec(`docker run --rm ${sanitizedImageName} ${command}`, (err, stdout, stderr) => {
            if (err) {
                console.debug(err);
                console.error('Docker run error:', stderr);
                reject(new Error('Docker run failed. Check the script or example usage.'));
            } else {
                console.log('Docker run output:', stdout);
                resolve(stdout);
            }
        });
    });
}

module.exports = { buildDockerImage, testDockerImage };
