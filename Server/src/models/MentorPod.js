const mongoose = require('mongoose');

const weeklyTaskSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date },
});

const mentorPodSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    goal: { type: String, required: true }, // e.g. "Get React internship ready"
    description: { type: String, default: '' },
    maxStudents: { type: Number, default: 5 },
    durationWeeks: { type: Number, default: 4 },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    weeklyTasks: [weeklyTaskSchema],
    status: { type: String, enum: ['open', 'active', 'completed'], default: 'open' },
    startDate: { type: Date },
    endDate: { type: Date },
    summaryNote: { type: String, default: '' }, // written by mentor at end
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorPod', mentorPodSchema);
