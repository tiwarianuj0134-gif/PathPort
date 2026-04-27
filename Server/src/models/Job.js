const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    isRemote: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['internship', 'full_time', 'part_time', 'contract', 'freelance'],
      required: true,
    },
    description: { type: String, required: true },
    responsibilities: { type: String, default: '' },
    requiredSkills: [{ type: String }],
    stipendMin: { type: Number, default: null },
    stipendMax: { type: Number, default: null },
    applicationDeadline: { type: Date },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    oqiScore: { type: Number, default: null }, // computed from reviews
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
