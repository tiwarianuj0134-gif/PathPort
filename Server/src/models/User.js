const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  type: { type: String, enum: ['internship', 'part_time', 'full_time', 'volunteer', 'project', 'freelance'], default: 'internship' },
  startDate: Date,
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  description: String,
  skills: [String],
});

const mentorProfileSchema = new mongoose.Schema({
  areasOfExpertise: [String],
  yearsOfExperience: { type: Number, default: 0 },
  currentCompany: { type: String, default: '' },
  currentRole: { type: String, default: '' },
  bio: { type: String, default: '' },
  languages: [String],
  slotsPerWeek: { type: Number, default: 2 },
  mentorType: { type: String, enum: ['1-1', 'group', 'both'], default: 'both' },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
});

const educationSchema = new mongoose.Schema({
  college: String,
  degree: String,
  branch: String,
  startYear: Number,
  endYear: Number,
  cgpa: String,
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  years: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  endorsements: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'recruiter', 'mentor', 'admin'], default: 'student' },
    headline: { type: String, default: '' },
    about: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [skillSchema],
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolioUrl: { type: String, default: '' },
    },
    careerGoal: { type: String, default: '' },
    mentorProfile: mentorProfileSchema,
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
