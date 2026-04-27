const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
    type: {
      type: String,
      enum: [
        'connection_request',
        'connection_accepted',
        'application_update',
        'new_recommendation',
        'post_like',
        'post_comment',
        'pod_invite',
        'simulation_complete',
        'endorsement',
      ],
      required: true,
    },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    link: { type: String, default: '' }, // frontend route to navigate to
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
