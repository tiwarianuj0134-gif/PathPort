const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const linkSchema = new mongoose.Schema({
  label: String,
  url: String,
});

const evidenceCardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['project', 'course', 'hackathon', 'internship_task', 'simulation'],
      required: true,
    },
    description: { type: String, required: true },
    skills: [{ type: String }],
    links: [linkSchema],
    feedback: [feedbackSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('EvidenceCard', evidenceCardSchema);
