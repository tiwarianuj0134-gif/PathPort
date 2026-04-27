const express = require('express');
const { getNotifications, getUnreadCount, markAllRead, markRead } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/mark-all-read', protect, markAllRead);
router.put('/:id/read', protect, markRead);

module.exports = router;
