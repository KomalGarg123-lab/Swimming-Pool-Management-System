const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper: Standard response
const sendRes = (res, success, message, data = {}) => {
  res.json({ success, message, data });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return sendRes(res, false, 'All fields required');
    const exists = await User.findOne({ email });
    if (exists) return sendRes(res, false, 'Email already registered');
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    sendRes(res, true, 'Registration successful', { userId: user._id });
  } catch (err) {
    sendRes(res, false, 'Registration failed', { error: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return sendRes(res, false, 'All fields required');
    const user = await User.findOne({ email });
    if (!user) return sendRes(res, false, 'Invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendRes(res, false, 'Invalid credentials');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    sendRes(res, true, 'Login successful', { userId: user._id, role: user.role });
  } catch (err) {
    sendRes(res, false, 'Login failed', { error: err.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
  sendRes(res, true, 'Logged out');
};
