const fs = require('fs');
const path = require('path');
const LLMProvider = require('../core/aiClient/llmProvider');
const { buildDockerImage, testDockerImage } = require('../core/dockerManager');

async function wrapScriptProcess(scriptPath, exampleUsage) {
    // Get the current working directory
    const basePath = process.cwd();
    const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
    const dockerfilePath = path.join(path.dirname(scriptPath), 'Dockerfile');
    const imageName = 'script-wrapper:latest';

    try {
        console.log('Selecting LLM provider...');
        const llm = LLMProvider.getInstance();

        console.log('Generating Dockerfile...');
        const dockerfile = await llm.generateDockerfile(scriptContent, path.relative(basePath,scriptPath));

        console.log('Saving Dockerfile...');
        fs.writeFileSync(dockerfilePath, dockerfile, 'utf-8');

        console.log('Building Docker image...');
        await buildDockerImage(dockerfilePath, imageName);

        console.log('Testing Docker image...');
        const result = await testDockerImage(imageName, exampleUsage);

        console.log('Docker test completed successfully.');
        return result;
    } catch (error) {
        console.error('Error during wrapping process:', error.message);
        throw error;
    } finally {
        if (fs.existsSync(dockerfilePath)) {
            fs.unlinkSync(dockerfilePath); // Cleanup Dockerfile after completion
        }
    }
}

module.exports = { wrapScriptProcess };
