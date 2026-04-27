const express = require('express');
const { getConversation, sendMessage, getThreads } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/threads', protect, getThreads);
router.get('/:userId', protect, getConversation);
router.post('/', protect, sendMessage);

module.exports = router;
