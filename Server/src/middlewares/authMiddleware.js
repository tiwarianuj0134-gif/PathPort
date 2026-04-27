const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/User');

/** Verifies JWT from httpOnly cookie and attaches user to req */
const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passwordHash');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

/** Restricts access to specific roles */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
    }
    next();
  };
};

module.exports = { protect, authorize };
