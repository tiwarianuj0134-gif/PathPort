const SkillNode = require('../models/SkillNode');

/** GET /api/skills */
const getMySkills = async (req, res, next) => {
  try {
    const skills = await SkillNode.find({ userId: req.user._id });
    res.json(skills);
  } catch (err) {
    next(err);
  }
};

/** GET /api/skills/user/:userId */
const getUserSkills = async (req, res, next) => {
  try {
    const skills = await SkillNode.find({ userId: req.params.userId });
    res.json(skills);
  } catch (err) {
    next(err);
  }
};

/** POST /api/skills */
const createSkill = async (req, res, next) => {
  try {
    const skill = await SkillNode.create({ ...req.body, userId: req.user._id });
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/skills/:id */
const updateSkill = async (req, res, next) => {
  try {
    const skill = await SkillNode.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!skill) return res.status(404).json({ message: 'Skill not found.' });
    res.json(skill);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/skills/:id */
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await SkillNode.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ message: 'Skill not found.' });
    res.json({ message: 'Skill deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMySkills, getUserSkills, createSkill, updateSkill, deleteSkill };
