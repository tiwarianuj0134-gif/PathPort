const mongoose = require('mongoose');

const mentorSessionSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorOffer', default: null },
    topic: { type: String, required: true },
    requestedTimeSlots: [String],
    acceptedTime: { type: String, default: '' },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected', 'completed'],
      default: 'requested',
    },
    notes: { type: String, default: '' },
    meetingLink: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorSession', mentorSessionSchema);
