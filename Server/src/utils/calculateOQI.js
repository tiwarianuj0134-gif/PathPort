/**
 * Calculates the Opportunity Quality Index (OQI) for a job posting.
 * OQI is a 0–100 score derived from student reviews.
 *
 * Review fields: learning, support, clarity, fairness (each 1–5)
 * @param {Array} reviews - Array of Review documents
 * @returns {number} OQI score 0–100
 */
const calculateOQI = (reviews) => {
  if (!reviews || reviews.length === 0) return null;

  const total = reviews.reduce((sum, review) => {
    const avg =
      (review.ratings.learning +
        review.ratings.support +
        review.ratings.clarity +
        review.ratings.fairness) /
      4;
    return sum + avg;
  }, 0);

  // Average across all reviews, then scale from 1–5 to 0–100
  const avgRating = total / reviews.length;
  return Math.round(((avgRating - 1) / 4) * 100);
};

/**
 * Returns a grade label based on OQI score.
 * @param {number|null} score
 * @returns {'A'|'B'|'C'|'N/A'}
 */
const getOQIGrade = (score) => {
  if (score === null || score === undefined) return 'N/A';
  if (score >= 70) return 'A';
  if (score >= 40) return 'B';
  return 'C';
};

module.exports = { calculateOQI, getOQIGrade };
