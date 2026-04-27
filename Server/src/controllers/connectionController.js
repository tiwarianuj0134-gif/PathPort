const Connection = require('../models/Connection');

/** POST /api/connections/request */
const sendRequest = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot connect with yourself.' });
    }

    const existing = await Connection.findOne({
      $or: [
        { requesterId: req.user._id, recipientId },
        { requesterId: recipientId, recipientId: req.user._id },
      ],
    });
    if (existing) return res.status(409).json({ message: 'Connection already exists.' });

    const connection = await Connection.create({ requesterId: req.user._id, recipientId });
    res.status(201).json(connection);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/connections/:id/respond */
const respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    const connection = await Connection.findOne({ _id: req.params.id, recipientId: req.user._id });
    if (!connection) return res.status(404).json({ message: 'Connection request not found.' });

    connection.status = status;
    await connection.save();
    res.json(connection);
  } catch (err) {
    next(err);
  }
};

/** GET /api/connections */
const getMyConnections = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      $or: [{ requesterId: req.user._id }, { recipientId: req.user._id }],
      status: 'accepted',
    })
      .populate('requesterId', 'name avatarUrl headline')
      .populate('recipientId', 'name avatarUrl headline');
    res.json(connections);
  } catch (err) {
    next(err);
  }
};

/** GET /api/connections/pending */
const getPendingRequests = async (req, res, next) => {
  try {
    const pending = await Connection.find({ recipientId: req.user._id, status: 'pending' }).populate(
      'requesterId',
      'name avatarUrl headline'
    );
    res.json(pending);
  } catch (err) {
    next(err);
  }
};

module.exports = { sendRequest, respondToRequest, getMyConnections, getPendingRequests };
