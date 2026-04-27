const express = require('express');
const {
  applyToJob, getMyApplications, getApplicationsForJob,
  updateApplicationStatus, updateRecruiterNote,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student'), applyToJob);
router.get('/mine', protect, authorize('student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getApplicationsForJob);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.patch('/:id/note', protect, authorize('recruiter', 'admin'), updateRecruiterNote);

module.exports = router;
