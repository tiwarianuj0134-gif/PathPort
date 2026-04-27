const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    mood: {
      type: String,
      enum: ['great', 'good', 'neutral', 'bad', 'struggling'],
      default: 'neutral',
    },
    visibility: { type: String, enum: ['private', 'public'], default: 'private' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
