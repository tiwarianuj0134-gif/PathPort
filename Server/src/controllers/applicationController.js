const Application = require('../models/Application');
const Job = require('../models/Job');

/** POST /api/applications */
const applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverMessage } = req.body;
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not available.' });
    }
    const existing = await Application.findOne({ jobId, studentId: req.user._id });
    if (existing) {
      return res.status(409).json({ message: 'You have already applied to this job.' });
    }
    const application = await Application.create({
      jobId,
      studentId: req.user._id,
      coverMessage,
      stageHistory: [{ status: 'applied' }],
    });
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

/** GET /api/applications/mine */
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('jobId', 'title companyName location type status')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/** GET /api/applications/job/:jobId — recruiter sees all applicants */
const getApplicationsForJob = async (req, res, next) => {
  try {
    if (!req.params.jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid job ID.' });
    }
    const job = await Job.findOne({ _id: req.params.jobId, recruiterId: req.user._id });
    if (!job) return res.status(403).json({ message: 'Not authorized or job not found.' });

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'name email avatarUrl headline skills education resumeUrl location')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/applications/:id/status — recruiter updates pipeline stage */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['applied', 'shortlisted', 'test', 'interview', 'offer', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) return res.status(404).json({ message: 'Application not found.' });

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    application.status = status;
    application.stageHistory.push({ status, note: note || '' });
    await application.save();
    res.json(application);
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/applications/:id/note — recruiter saves internal note */
const updateRecruiterNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) return res.status(404).json({ message: 'Application not found.' });

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    application.recruiterNote = note;
    await application.save();
    res.json({ message: 'Note saved.', recruiterNote: application.recruiterNote });
  } catch (err) {
    next(err);
  }
};

module.exports = { applyToJob, getMyApplications, getApplicationsForJob, updateApplicationStatus, updateRecruiterNote };
