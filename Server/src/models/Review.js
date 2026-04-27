const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ratings: {
      learning: { type: Number, min: 1, max: 5, required: true },
      support: { type: Number, min: 1, max: 5, required: true },
      clarity: { type: Number, min: 1, max: 5, required: true },
      fairness: { type: Number, min: 1, max: 5, required: true },
    },
    overallRating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
