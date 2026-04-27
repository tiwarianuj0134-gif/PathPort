const Review = require('../models/Review');
const Job = require('../models/Job');
const { calculateOQI } = require('../utils/calculateOQI');

/** POST /api/reviews */
const createReview = async (req, res, next) => {
  try {
    const { jobId, ratings, overallRating, comment } = req.body;

    const existing = await Review.findOne({ jobId, studentId: req.user._id });
    if (existing) return res.status(409).json({ message: 'You have already reviewed this opportunity.' });

    const review = await Review.create({ jobId, studentId: req.user._id, ratings, overallRating, comment });

    // Recompute and save OQI on the job
    const allReviews = await Review.find({ jobId });
    const oqi = calculateOQI(allReviews);
    await Job.findByIdAndUpdate(jobId, { oqiScore: oqi });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

/** GET /api/reviews/job/:jobId */
const getJobReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ jobId: req.params.jobId })
      .populate('studentId', 'name avatarUrl')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

module.exports = { createReview, getJobReviews };
