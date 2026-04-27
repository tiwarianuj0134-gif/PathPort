const express = require('express');
const { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs, toggleJobStatus } = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getJobs);
router.get('/recruiter/mine', protect, authorize('recruiter', 'admin'), getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), toggleJobStatus);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
