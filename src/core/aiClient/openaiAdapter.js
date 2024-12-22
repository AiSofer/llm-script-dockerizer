const axios = require('axios');

class OpenAIAdapter {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY must be set for OpenAI integration.');
        }
        this.apiKey = process.env.OPENAI_API_KEY;
        this.apiUrl = 'https://api.openai.com/v1/completions';
    }

    async generateDockerfile(script) {
        try {
            const prompt = `
Generate a Dockerfile that containerizes the following script.
The scripts could be any one-pager script in any scripting language.
The Dockerfile should run the script as the container's main process.
Output ONLY the Dockerfile, without any additional explanations or comments.
Path:
${path}
Script:
${script}
`;

            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'GPT-4o',
                    prompt,
                    max_tokens: 300,
                },
                {
                    headers: { Authorization: `Bearer ${this.apiKey}` },
                    timeout: 10000,
                }
            );

            if (response.status !== 200 || !response.data.choices) {
                throw new Error('Invalid response from OpenAI API.');
            }

            return response.data.choices[0].text.trim();
        } catch (error) {
            console.error('OpenAI error:', error.message);
            throw new Error('Failed to generate Dockerfile using OpenAI.');
        }
    }
}

module.exports = OpenAIAdapter;
