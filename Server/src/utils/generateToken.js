const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

/**
 * Signs a JWT and sets it as an httpOnly cookie on the response.
 * @param {object} res - Express response object
 * @param {string} userId - MongoDB user _id
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

module.exports = generateToken;
