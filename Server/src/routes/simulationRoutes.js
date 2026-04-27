const express = require('express');
const { getSimulations, getSimulationById, createSimulation, submitSimulation } = require('../controllers/simulationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getSimulations);
router.get('/:id', getSimulationById);
router.post('/', protect, authorize('mentor', 'admin'), createSimulation);
router.post('/:id/submit', protect, authorize('student'), submitSimulation);

module.exports = router;
