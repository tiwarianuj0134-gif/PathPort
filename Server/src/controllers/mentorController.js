const User = require('../models/User');
const MentorOffer = require('../models/MentorOffer');
const MentorSession = require('../models/MentorSession');
const MentorReview = require('../models/MentorReview');

/** GET /api/mentors — list all mentor users */
const getMentors = async (req, res, next) => {
  try {
    const { expertise, q } = req.query;
    const filter = { role: 'mentor' };
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (expertise) filter['mentorProfile.areasOfExpertise'] = { $in: [expertise] };

    const mentors = await User.find(filter)
      .select('name headline avatarUrl location mentorProfile skills')
      .sort({ 'mentorProfile.rating': -1 });
    res.json(mentors);
  } catch (err) {
    next(err);
  }
};

/** GET /api/mentors/:id — mentor public profile */
const getMentorById = async (req, res, next) => {
  try {
    const mentor = await User.findOne({ _id: req.params.id, role: 'mentor' })
      .select('-passwordHash');
    if (!mentor) return res.status(404).json({ message: 'Mentor not found.' });

    const offers = await MentorOffer.find({ mentorId: req.params.id, isActive: true });
    const reviews = await MentorReview.find({ mentorId: req.params.id, reviewerRole: 'student' })
      .populate('studentId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ mentor, offers, reviews });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/mentors/profile — mentor updates their mentor profile */
const updateMentorProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { mentorProfile: req.body },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/** GET /api/mentors/offers/mine — mentor sees their own offers */
const getMyOffers = async (req, res, next) => {
  try {
    const offers = await MentorOffer.find({ mentorId: req.user._id }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    next(err);
  }
};

/** POST /api/mentors/offers — mentor creates an offer */
const createOffer = async (req, res, next) => {
  try {
    const offer = await MentorOffer.create({ ...req.body, mentorId: req.user._id });
    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/mentors/offers/:id — mentor updates offer */
const updateOffer = async (req, res, next) => {
  try {
    const offer = await MentorOffer.findOneAndUpdate(
      { _id: req.params.id, mentorId: req.user._id },
      req.body,
      { new: true }
    );
    if (!offer) return res.status(404).json({ message: 'Offer not found.' });
    res.json(offer);
  } catch (err) {
    next(err);
  }
};

/** POST /api/mentors/:mentorId/request-session — student requests a session */
const requestSession = async (req, res, next) => {
  try {
    const { topic, requestedTimeSlots, offerId, notes } = req.body;
    const mentor = await User.findOne({ _id: req.params.mentorId, role: 'mentor' });
    if (!mentor) return res.status(404).json({ message: 'Mentor not found.' });

    const session = await MentorSession.create({
      mentorId: req.params.mentorId,
      studentId: req.user._id,
      offerId: offerId || null,
      topic,
      requestedTimeSlots: requestedTimeSlots || [],
      notes: notes || '',
    });
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

/** GET /api/mentors/sessions/mine — student sees their sessions */
const getMySessionsAsStudent = async (req, res, next) => {
  try {
    const sessions = await MentorSession.find({ studentId: req.user._id })
      .populate('mentorId', 'name avatarUrl headline mentorProfile')
      .populate('offerId', 'title')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

/** GET /api/mentors/sessions — mentor sees sessions assigned to them */
const getSessionsAsMentor = async (req, res, next) => {
  try {
    const sessions = await MentorSession.find({ mentorId: req.user._id })
      .populate('studentId', 'name avatarUrl headline skills education')
      .populate('offerId', 'title')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/mentors/sessions/:id — mentor accepts/rejects/completes */
const updateSession = async (req, res, next) => {
  try {
    const { status, acceptedTime, meetingLink, notes } = req.body;
    const session = await MentorSession.findOne({ _id: req.params.id, mentorId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    if (status) session.status = status;
    if (acceptedTime) session.acceptedTime = acceptedTime;
    if (meetingLink) session.meetingLink = meetingLink;
    if (notes) session.notes = notes;

    await session.save();

    // Update mentor stats when session completed
    if (status === 'completed') {
      await User.findByIdAndUpdate(req.user._id, { $inc: { 'mentorProfile.totalSessions': 1 } });
    }

    res.json(session);
  } catch (err) {
    next(err);
  }
};

/** POST /api/mentors/sessions/:id/review — either side submits review */
const submitReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const session = await MentorSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    if (session.status !== 'completed') return res.status(400).json({ message: 'Session not completed yet.' });

    const isMentor = session.mentorId.toString() === req.user._id.toString();
    const isStudent = session.studentId.toString() === req.user._id.toString();
    if (!isMentor && !isStudent) return res.status(403).json({ message: 'Not authorized.' });

    const reviewerRole = isMentor ? 'mentor' : 'student';
    const review = await MentorReview.create({
      sessionId: session._id,
      mentorId: session.mentorId,
      studentId: session.studentId,
      reviewerRole,
      rating,
      comment,
    });

    // Update mentor average rating
    if (reviewerRole === 'student') {
      const allReviews = await MentorReview.find({ mentorId: session.mentorId, reviewerRole: 'student' });
      const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
      await User.findByIdAndUpdate(session.mentorId, { 'mentorProfile.rating': Math.round(avg * 10) / 10 });
    }

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMentors, getMentorById, updateMentorProfile,
  getMyOffers, createOffer, updateOffer,
  requestSession, getMySessionsAsStudent, getSessionsAsMentor,
  updateSession, submitReview,
};
