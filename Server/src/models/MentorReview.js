const mongoose = require('mongoose');

const mentorReviewSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorSession', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewerRole: { type: String, enum: ['mentor', 'student'], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

mentorReviewSchema.index({ sessionId: 1, reviewerRole: 1 }, { unique: true });

module.exports = mongoose.model('MentorReview', mentorReviewSchema);
