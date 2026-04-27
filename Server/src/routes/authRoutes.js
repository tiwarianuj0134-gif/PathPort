const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/ValidationRequest');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('role').optional().isIn(['student', 'recruiter', 'mentor']).withMessage('Invalid role.'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validateRequest,
  login
);

router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
