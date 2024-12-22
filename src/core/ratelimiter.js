class RateLimiter {
    constructor(budget = 5.0, costPerThousandTokens = 0.02) {
        this.budget = budget;
        this.costPerThousandTokens = costPerThousandTokens;
        this.remainingBudget = budget; // Start with the full budget
        this.tokenUsage = 0; // Track total tokens used
    }

    estimateCost(tokens) {
        return (tokens / 1000) * this.costPerThousandTokens;
    }

    canMakeRequest(tokens) {
        const cost = this.estimateCost(tokens);
        return this.remainingBudget >= cost;
    }

    recordUsage(tokens) {
        const cost = this.estimateCost(tokens);
        this.tokenUsage += tokens;
        this.remainingBudget -= cost;
    }

    getUsage() {
        return {
            totalTokens: this.tokenUsage,
            remainingBudget: this.remainingBudget.toFixed(2),
        };
    }
}

module.exports = RateLimiter;
