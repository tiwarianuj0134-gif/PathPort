const User = require('../models/User');

/** GET /api/users/:id */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/users/profile — update own profile */
const updateProfile = async (req, res, next) => {
  try {
    const {
      headline, about, avatarUrl, location, resumeUrl,
      education, experience, skills, socialLinks, careerGoal,
      mentorProfile,
    } = req.body;

    const updateFields = {};
    if (headline !== undefined) updateFields.headline = headline;
    if (about !== undefined) updateFields.about = about;
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;
    if (location !== undefined) updateFields.location = location;
    if (resumeUrl !== undefined) updateFields.resumeUrl = resumeUrl;
    if (education !== undefined) updateFields.education = education;
    if (experience !== undefined) updateFields.experience = experience;
    if (skills !== undefined) updateFields.skills = skills;
    if (socialLinks !== undefined) updateFields.socialLinks = socialLinks;
    if (careerGoal !== undefined) updateFields.careerGoal = careerGoal;
    if (mentorProfile !== undefined) updateFields.mentorProfile = mentorProfile;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (err) {
    next(err);
  }
};

/** GET /api/users/search?q= */
const searchUsers = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { headline: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name headline avatarUrl role location')
      .limit(20);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/** POST /api/users/:id/endorse/:skillName — endorse a skill */
const endorseSkill = async (req, res, next) => {
  try {
    const { id, skillName } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot endorse your own skills.' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const skill = user.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
    if (!skill) return res.status(404).json({ message: 'Skill not found.' });

    skill.endorsements = (skill.endorsements || 0) + 1;
    await user.save();
    res.json({ message: 'Skill endorsed.', endorsements: skill.endorsements });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserById, updateProfile, searchUsers, endorseSkill };
