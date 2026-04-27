const mongoose = require('mongoose');

const skillNodeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['technical', 'soft', 'tool', 'domain'],
      default: 'technical',
    },
    status: {
      type: String,
      enum: ['to_learn', 'in_progress', 'verified'],
      default: 'to_learn',
    },
    level: { type: Number, min: 0, max: 3, default: 0 },
    goalTag: { type: String, default: '' }, // e.g. "frontend_dev"
    relatedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SkillNode' }],
    positionX: { type: Number, default: 0 },
    positionY: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkillNode', skillNodeSchema);
