const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/jobs', require('./jobRoutes'));
router.use('/applications', require('./applicationRoutes'));
router.use('/evidence', require('./evidenceRoutes'));
router.use('/skills', require('./skillRoutes'));
router.use('/journal', require('./journalRoutes'));
router.use('/connections', require('./connectionRoutes'));
router.use('/messages', require('./messageRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/ai', require('./aiRoutes'));
router.use('/posts', require('./postRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/pods', require('./podRoutes'));
router.use('/simulations', require('./simulationRoutes'));
router.use('/mentors', require('./mentorRoutes'));

module.exports = router;
