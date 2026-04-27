const express = require('express');
const { getMyEvidence, getUserEvidence, getEvidenceById, createEvidence, updateEvidence, deleteEvidence, addFeedback } = require('../controllers/evidenceController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyEvidence);
router.get('/user/:userId', getUserEvidence);
router.get('/:id', getEvidenceById);
router.post('/', protect, createEvidence);
router.put('/:id', protect, updateEvidence);
router.delete('/:id', protect, deleteEvidence);
router.post('/:id/feedback', protect, addFeedback);

module.exports = router;
