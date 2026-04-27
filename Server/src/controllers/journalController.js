const JournalEntry = require('../models/JournalEntry');

/** GET /api/journal */
const getMyJournal = async (req, res, next) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

/** POST /api/journal */
const createEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.create({ ...req.body, userId: req.user._id });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/journal/:id */
const updateEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found.' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/journal/:id */
const deleteEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Entry not found.' });
    res.json({ message: 'Entry deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyJournal, createEntry, updateEntry, deleteEntry };
