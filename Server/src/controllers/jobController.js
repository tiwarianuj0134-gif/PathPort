const Job = require('../models/Job');
const Application = require('../models/Application');
const Review = require('../models/Review');
const { calculateOQI } = require('../utils/calculateOQI');

const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

/** GET /api/jobs */
const getJobs = async (req, res, next) => {
  try {
    const { q, type, location, skills, page = 1, limit = 12 } = req.query;
    const filter = { status: 'open' };
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (skills) {
      const skillArr = skills.split(',').map((s) => s.trim());
      filter.requiredSkills = { $in: skillArr };
    }
    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .populate('recruiterId', 'name companyName avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

/** GET /api/jobs/:id */
const getJobById = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Job not found.' });
    const job = await Job.findById(req.params.id).populate('recruiterId', 'name avatarUrl headline');
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    const reviews = await Review.find({ jobId: job._id });
    const oqi = calculateOQI(reviews);
    res.json({ ...job.toObject(), oqiScore: oqi, reviewCount: reviews.length });
  } catch (err) {
    next(err);
  }
};

/** POST /api/jobs */
const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, recruiterId: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/jobs/:id */
const updateJob = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Job not found.' });
    const job = await Job.findOne({ _id: req.params.id, recruiterId: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found or not authorized.' });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/jobs/:id */
const deleteJob = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Job not found.' });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    await job.deleteOne();
    res.json({ message: 'Job removed.' });
  } catch (err) {
    next(err);
  }
};

/** GET /api/jobs/recruiter/mine — with applicant counts */
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const counts = await Application.aggregate([
          { $match: { jobId: job._id } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);
        const stats = { applied: 0, shortlisted: 0, test: 0, interview: 0, offer: 0, rejected: 0 };
        counts.forEach((c) => { stats[c._id] = c.count; });
        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        return { ...job.toObject(), applicantStats: stats, totalApplicants: total };
      })
    );
    res.json(jobsWithStats);
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/jobs/:id/status — toggle open/closed */
const toggleJobStatus = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Job not found.' });
    const job = await Job.findOne({ _id: req.params.id, recruiterId: req.user._id });
    if (!job) return res.status(404).json({ message: 'Not found or not authorized.' });
    job.status = job.status === 'open' ? 'closed' : 'open';
    await job.save();
    res.json({ status: job.status });
  } catch (err) {
    next(err);
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs, toggleJobStatus };
