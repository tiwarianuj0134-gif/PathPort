const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submissionUrl: { type: String, required: true },
  notes: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  evidenceCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'EvidenceCard', default: null },
});

const simulationTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['frontend', 'backend', 'data', 'design', 'general'], default: 'general' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    estimatedHours: { type: Number, default: 3 },
    skills: [{ type: String }],
    resources: [{ label: String, url: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submissions: [submissionSchema],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SimulationTask', simulationTaskSchema);
