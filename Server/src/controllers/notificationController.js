const Notification = require('../models/Notification');

/** GET /api/notifications */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .populate('fromUserId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

/** GET /api/notifications/unread-count */
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id, read: false });
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/notifications/mark-all-read */
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/notifications/:id/read */
const markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { read: true });
    res.json({ message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
};

/** Helper to create a notification (used by other controllers) */
const createNotification = async ({ userId, type, fromUserId, message, link }) => {
  try {
    await Notification.create({ userId, type, fromUserId, message, link });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

module.exports = { getNotifications, getUnreadCount, markAllRead, markRead, createNotification };
