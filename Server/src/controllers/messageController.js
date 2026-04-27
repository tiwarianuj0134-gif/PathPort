const Message = require('../models/Message');
const Connection = require('../models/Connection');

/** GET /api/messages/:userId – get conversation with a user */
const getConversation = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { fromUserId: req.user._id, toUserId: req.params.userId },
        { fromUserId: req.params.userId, toUserId: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { fromUserId: req.params.userId, toUserId: req.user._id, readAt: null },
      { readAt: new Date() }
    );

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

/** POST /api/messages */
const sendMessage = async (req, res, next) => {
  try {
    const { toUserId, content } = req.body;

    // Only connected users can message each other
    const connection = await Connection.findOne({
      $or: [
        { requesterId: req.user._id, recipientId: toUserId },
        { requesterId: toUserId, recipientId: req.user._id },
      ],
      status: 'accepted',
    });
    if (!connection) {
      return res.status(403).json({ message: 'You must be connected to send messages.' });
    }

    const message = await Message.create({ fromUserId: req.user._id, toUserId, content });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

/** GET /api/messages/threads – list all conversation partners */
const getThreads = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('fromUserId', 'name avatarUrl')
      .populate('toUserId', 'name avatarUrl');

    // Deduplicate by conversation partner
    const seen = new Set();
    const threads = [];
    for (const msg of messages) {
      const partnerId =
        msg.fromUserId._id.toString() === req.user._id.toString()
          ? msg.toUserId._id.toString()
          : msg.fromUserId._id.toString();
      if (!seen.has(partnerId)) {
        seen.add(partnerId);
        threads.push(msg);
      }
    }
    res.json(threads);
  } catch (err) {
    next(err);
  }
};

module.exports = { getConversation, sendMessage, getThreads };
