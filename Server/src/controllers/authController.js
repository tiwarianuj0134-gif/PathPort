const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/** POST /api/auth/register */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: role || 'student' });

    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/auth/login */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      headline: user.headline,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/auth/logout */
const logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
  res.json({ message: 'Logged out successfully.' });
};

/** GET /api/auth/me */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, getMe };
