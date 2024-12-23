const OpenAI = require("openai");
const {
  dockerfileExtraction,
  estimateTokens,
  createSafePrompt,
} = require("../../utils/helpers");
const RateLimiter = require("../ratelimiter");

// Initialize the rate limiter
const rateLimiter = new RateLimiter(process.env.BUDGET || 5.0);

class OpenAIAdapter {
  constructor(config = {}) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY must be set for OpenAI integration.");
    }
    // Configure the OpenAI API client
    this.apiKey = process.env.OPENAI_API_KEY;
    this.openai = new OpenAI({ apiKey: this.apiKey });

    // Default options for requests
    this.defaultOptions = {
      model: config.model || "gpt-4o",
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 512,
    };
  }
  /**
   * Sends a prompt that will generate a dockerfile to the OpenAI API.
   * @param {string} prompt - The prompt string to send.
   * @param {Object} [options] - Override options for the API call.
   * @returns {Promise<string>} - The response text from OpenAI.
   */
  async generateDockerfile(script, path, options = {}) {
    if (!script) {
      throw new Error("script is required.");
    }
    try {
      const prompt = createSafePrompt(path, script);
      const tokenEstimation = estimateTokens(prompt); // Estimated token usage
      if (!rateLimiter.canMakeRequest(tokenEstimation)) {
        throw new Error(
          "Rate limit exceeded. Remaining budget insufficient for this request."
        );
      }
      options = { messages: [{ role: "user", content: prompt }] };
      const requestOptions = { ...this.defaultOptions, ...options };

      const response = await this.openai.chat.completions.create(
        requestOptions
      );
      if (response?.choices?.[0]?.message) {
        const tokensUsed = estimateTokens(response.choices[0].message.content); // Actual tokens used
        rateLimiter.recordUsage(tokensUsed);

        console.debug("Token usage:", rateLimiter.getUsage());
        const dockerFile = dockerfileExtraction(
          response.choices[0].message.content.trim()
        );
        return dockerFile;
      } else {
        throw new Error("No valid response from OpenAI API.");
      }
    } catch (error) {
      console.error("Error communicating with OpenAI API:", error.message);
      throw error;
    }
  }
}

module.exports = OpenAIAdapter;
