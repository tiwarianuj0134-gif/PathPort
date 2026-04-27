const express = require('express');
const { getMyJournal, createEntry, updateEntry, deleteEntry } = require('../controllers/journalController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyJournal);
router.post('/', protect, createEntry);
router.put('/:id', protect, updateEntry);
router.delete('/:id', protect, deleteEntry);

module.exports = router;
