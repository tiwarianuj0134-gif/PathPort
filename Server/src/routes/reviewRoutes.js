const express = require('express');
const { createReview, getJobReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student'), createReview);
router.get('/job/:jobId', getJobReviews);

module.exports = router;
