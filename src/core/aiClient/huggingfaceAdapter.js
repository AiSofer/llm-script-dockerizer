const axios = require('axios');
const { dockerfileExtraction } = require("../../utils/helpers");

class HuggingFaceAdapter {
    constructor() {
        if (!process.env.HUGGINGFACE_API_KEY) {
            throw new Error('HUGGINGFACE_API_KEY must be set for Hugging Face integration.');
        }
        this.apiKey = process.env.HUGGINGFACE_API_KEY;
        this.apiUrl = 'https://api-inference.huggingface.co/models';
        this.model = process.env.HUGGINGFACE_MODEL || 'google/gemma-2-2b-it';
    }

    async generateDockerfile(script, path) {
        try {
            const prompt = `
Generate a Dockerfile that containerizes the following script and considering it's following path.
no need for requirements.txt
The scripts could be any one-pager script in any scripting language.
The Dockerfile should run the script as the container's main process.
Output ONLY the Dockerfile, without any additional explanations or comments.
Path:
${path}
Script:
${script}
`;

            const response = await axios.post(
                `${this.apiUrl}/${this.model}`,
                { inputs: prompt },
                {
                    headers: { Authorization: `Bearer ${this.apiKey}` },
                    timeout: 50000,
                }
            );

            if (response.status !== 200 || !response.data) {
                throw new Error('Invalid response from Hugging Face API.');
            }
            if (response?.data?.[0]?.generated_text) {
                const dockerFile = dockerfileExtraction(response.data[0].generated_text.trim());
                return dockerFile;
            } else {
                throw new Error("No valid response from OpenAI API.");
            }
        } catch (error) {
            console.error('Hugging Face error:', error.message);
            throw new Error('Failed to generate Dockerfile using Hugging Face.');
        }
    }
}

module.exports = HuggingFaceAdapter;
