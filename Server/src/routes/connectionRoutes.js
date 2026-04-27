const express = require('express');
const { sendRequest, respondToRequest, getMyConnections, getPendingRequests } = require('../controllers/connectionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Static routes first
router.get('/', protect, getMyConnections);
router.get('/pending', protect, getPendingRequests);
router.post('/request', protect, sendRequest);

// Dynamic routes last
router.put('/:id/respond', protect, respondToRequest);

module.exports = router;
