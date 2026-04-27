const express = require('express');
const { getMySkills, getUserSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getMySkills);
router.get('/user/:userId', getUserSkills);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
