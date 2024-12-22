const RateLimiter = require('../../core/ratelimiter');

describe('RateLimiter', () => {
    let rateLimiter;

    beforeEach(() => {
        rateLimiter = new RateLimiter(5.0); // Initialize with $5 budget
    });

    test('Allows requests within budget', () => {
        expect(rateLimiter.canMakeRequest(1000)).toBe(true); // $0.02 cost
        rateLimiter.recordUsage(1000);
        expect(rateLimiter.remainingBudget).toBeCloseTo(4.98, 2);
    });

    test('Blocks requests exceeding budget', () => {
        rateLimiter.recordUsage(250000); // Use up entire budget
        expect(rateLimiter.canMakeRequest(1000)).toBe(false);
    });

    test('Tracks token usage accurately', () => {
        rateLimiter.recordUsage(50000); // $1 cost
        rateLimiter.recordUsage(100000); // $2 cost
        expect(rateLimiter.getUsage()).toEqual({
            totalTokens: 150000,
            remainingBudget: '2.00',
        });
    });
});
