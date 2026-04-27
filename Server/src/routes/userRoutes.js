const express = require('express');
const { getUserById, updateProfile, searchUsers, endorseSkill } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Static routes first
router.get('/search', protect, searchUsers);
router.put('/profile', protect, updateProfile);

// Dynamic routes last
router.get('/:id', getUserById);
router.post('/:id/endorse/:skillName', protect, endorseSkill);

module.exports = router;
