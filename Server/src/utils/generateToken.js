const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

/**
 * Signs a JWT and sets it as an httpOnly cookie on the response.
 * In production (cross-origin: Vercel + Render), cookies need:
 *   secure: true  (HTTPS only)
 *   sameSite: 'none'  (cross-site requests allowed)
 * In development, sameSite: 'lax' works fine on localhost.
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,                        // HTTPS required in prod
    sameSite: isProd ? 'none' : 'lax',    // 'none' for cross-origin in prod
    maxAge: 7 * 24 * 60 * 60 * 1000,     // 7 days in ms
  });
};

module.exports = generateToken;
