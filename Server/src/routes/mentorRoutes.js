const express = require('express');
const {
  getMentors, getMentorById, updateMentorProfile,
  getMyOffers, createOffer, updateOffer,
  requestSession, getMySessionsAsStudent, getSessionsAsMentor,
  updateSession, submitReview,
} = require('../controllers/mentorController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// ── Static routes MUST come before /:mentorId to avoid conflicts ──

// Mentor profile management (mentor only)
router.put('/profile/me', protect, authorize('mentor'), updateMentorProfile);

// Mentor offers
router.get('/offers/mine', protect, authorize('mentor'), getMyOffers);
router.post('/offers', protect, authorize('mentor'), createOffer);
router.put('/offers/:id', protect, authorize('mentor'), updateOffer);

// Sessions — student side
router.get('/sessions/mine', protect, authorize('student'), getMySessionsAsStudent);

// Sessions — mentor side
router.get('/sessions/incoming', protect, authorize('mentor'), getSessionsAsMentor);
router.patch('/sessions/:id', protect, authorize('mentor'), updateSession);

// Reviews — both sides
router.post('/sessions/:id/review', protect, authorize('student', 'mentor'), submitReview);

// ── Dynamic routes last ──

// Public mentor listing
router.get('/', getMentors);

// Student requests a session with a specific mentor
router.post('/:mentorId/request-session', protect, authorize('student'), requestSession);

// Public mentor profile (must be last to avoid swallowing static routes)
router.get('/:mentorId', getMentorById);

module.exports = router;
