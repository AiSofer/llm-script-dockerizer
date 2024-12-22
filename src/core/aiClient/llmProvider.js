const OpenAIAdapter = require('./openaiAdapter');
const HuggingFaceAdapter = require('./huggingfaceAdapter');

const VENDOR = process.env.LLM_VENDOR || 'openai'; // Default to OpenAI

class LLMProvider {
    static getInstance() {
        switch (VENDOR.toLowerCase()) {
            case 'openai':
                return new OpenAIAdapter();
            case 'huggingface':
                return new HuggingFaceAdapter();
            default:
                throw new Error(`Unsupported LLM vendor: ${VENDOR}`);
        }
    }
}

module.exports = LLMProvider;
