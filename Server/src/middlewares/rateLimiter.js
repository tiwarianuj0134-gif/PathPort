const rateLimit = require('express-rate-limit');

/** Strict limiter for auth routes */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Moderate limiter for AI routes */
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { message: 'Too many AI requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/** General API limiter */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, aiLimiter, generalLimiter };
