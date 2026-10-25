import rateLimit from 'express-rate-limit';

// Skip rate limiting in automated testing environments
const isTestEnv = process.env.NODE_ENV === 'test';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 1000 : 25, // limit each IP to 25 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

export const purchaseRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isTestEnv ? 1000 : 30, // limit to 30 purchase actions per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Purchase request rate limit exceeded. Please wait a moment before trying again.'
  }
});
