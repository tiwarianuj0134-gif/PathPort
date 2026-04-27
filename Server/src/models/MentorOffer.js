const mongoose = require('mongoose');

const mentorOfferSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    format: { type: String, enum: ['one_time', 'weekly', 'pod'], default: 'one_time' },
    capacity: { type: Number, default: 1 },
    durationWeeks: { type: Number, default: 4 },
    skillsCovered: [String],
    targetAudience: { type: String, default: '' },
    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorOffer', mentorOfferSchema);
