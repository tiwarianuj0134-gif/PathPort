const express = require('express');
const { getPods, getMyPods, getPodById, createPod, joinPod, updatePod } = require('../controllers/podController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getPods);
router.get('/mine', protect, getMyPods);
router.get('/:id', getPodById);
router.post('/', protect, authorize('mentor', 'admin'), createPod);
router.post('/:id/join', protect, authorize('student'), joinPod);
router.put('/:id', protect, authorize('mentor', 'admin'), updatePod);

module.exports = router;
