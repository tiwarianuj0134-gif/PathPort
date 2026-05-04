const rateLimit = require('express-rate-limit');

/** Strict limiter for auth routes */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  // Required when behind Render/Heroku reverse proxy
  validate: { trustProxy: false },
});

/** Moderate limiter for AI routes */
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: 'Too many AI requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});

/** General API limiter */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});

module.exports = { authLimiter, aiLimiter, generalLimiter };
