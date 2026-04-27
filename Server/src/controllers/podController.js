const MentorPod = require('../models/MentorPod');

/** GET /api/pods — list open pods */
const getPods = async (req, res, next) => {
  try {
    const pods = await MentorPod.find({ status: 'open' })
      .populate('mentorId', 'name avatarUrl headline')
      .sort({ createdAt: -1 });
    res.json(pods);
  } catch (err) {
    next(err);
  }
};

/** GET /api/pods/mine — pods I'm in (as student or mentor) */
const getMyPods = async (req, res, next) => {
  try {
    const pods = await MentorPod.find({
      $or: [{ mentorId: req.user._id }, { students: req.user._id }],
    }).populate('mentorId', 'name avatarUrl headline');
    res.json(pods);
  } catch (err) {
    next(err);
  }
};

/** GET /api/pods/:id */
const getPodById = async (req, res, next) => {
  try {
    const pod = await MentorPod.findById(req.params.id)
      .populate('mentorId', 'name avatarUrl headline')
      .populate('students', 'name avatarUrl headline');
    if (!pod) return res.status(404).json({ message: 'Pod not found.' });
    res.json(pod);
  } catch (err) {
    next(err);
  }
};

/** POST /api/pods — mentor creates a pod */
const createPod = async (req, res, next) => {
  try {
    const pod = await MentorPod.create({ ...req.body, mentorId: req.user._id });
    res.status(201).json(pod);
  } catch (err) {
    next(err);
  }
};

/** POST /api/pods/:id/join — student joins a pod */
const joinPod = async (req, res, next) => {
  try {
    const pod = await MentorPod.findById(req.params.id);
    if (!pod) return res.status(404).json({ message: 'Pod not found.' });
    if (pod.status !== 'open') return res.status(400).json({ message: 'Pod is not open for joining.' });
    if (pod.students.length >= pod.maxStudents) return res.status(400).json({ message: 'Pod is full.' });
    if (pod.students.includes(req.user._id)) return res.status(409).json({ message: 'Already in this pod.' });

    pod.students.push(req.user._id);
    await pod.save();
    res.json({ message: 'Joined pod successfully.', pod });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/pods/:id — mentor updates pod */
const updatePod = async (req, res, next) => {
  try {
    const pod = await MentorPod.findOneAndUpdate(
      { _id: req.params.id, mentorId: req.user._id },
      req.body,
      { new: true }
    );
    if (!pod) return res.status(404).json({ message: 'Pod not found or not authorized.' });
    res.json(pod);
  } catch (err) {
    next(err);
  }
};

module.exports = { getPods, getMyPods, getPodById, createPod, joinPod, updatePod };
