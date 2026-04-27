const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
