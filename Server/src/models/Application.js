const mongoose = require('mongoose');

const stageHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'test', 'interview', 'offer', 'rejected'],
  },
  changedAt: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'test', 'interview', 'offer', 'rejected'],
      default: 'applied',
    },
    coverMessage: { type: String, default: '' },
    recruiterNote: { type: String, default: '' },
    stageHistory: [stageHistorySchema],
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
