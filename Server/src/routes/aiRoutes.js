const express = require('express');
const { jarvis, support, translate } = require('../controllers/aiController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { aiLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Jarvis — student/mentor only, rate limited
router.post('/jarvis', aiLimiter, protect, authorize('student', 'mentor'), jarvis);

// Support chatbot — public, rate limited
router.post('/support', aiLimiter, support);

// Career Translator — auth required
router.post('/translate', aiLimiter, protect, translate);

module.exports = router;
