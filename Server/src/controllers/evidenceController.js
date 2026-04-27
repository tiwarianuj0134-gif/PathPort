const EvidenceCard = require('../models/EvidenceCard');

/** GET /api/evidence */
const getMyEvidence = async (req, res, next) => {
  try {
    const cards = await EvidenceCard.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    next(err);
  }
};

/** GET /api/evidence/user/:userId */
const getUserEvidence = async (req, res, next) => {
  try {
    const cards = await EvidenceCard.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    next(err);
  }
};

/** GET /api/evidence/:id */
const getEvidenceById = async (req, res, next) => {
  try {
    const card = await EvidenceCard.findById(req.params.id).populate('feedback.fromUserId', 'name avatarUrl');
    if (!card) return res.status(404).json({ message: 'Evidence card not found.' });
    res.json(card);
  } catch (err) {
    next(err);
  }
};

/** POST /api/evidence */
const createEvidence = async (req, res, next) => {
  try {
    const card = await EvidenceCard.create({ ...req.body, userId: req.user._id });
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/evidence/:id */
const updateEvidence = async (req, res, next) => {
  try {
    const card = await EvidenceCard.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) return res.status(404).json({ message: 'Not found or not authorized.' });

    Object.assign(card, req.body);
    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/evidence/:id */
const deleteEvidence = async (req, res, next) => {
  try {
    const card = await EvidenceCard.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!card) return res.status(404).json({ message: 'Not found or not authorized.' });
    res.json({ message: 'Evidence card deleted.' });
  } catch (err) {
    next(err);
  }
};

/** POST /api/evidence/:id/feedback */
const addFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const card = await EvidenceCard.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Evidence card not found.' });

    card.feedback.push({ fromUserId: req.user._id, rating, comment });
    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyEvidence, getUserEvidence, getEvidenceById, createEvidence, updateEvidence, deleteEvidence, addFeedback };
