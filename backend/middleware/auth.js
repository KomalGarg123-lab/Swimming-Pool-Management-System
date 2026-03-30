const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// isAuth: verify JWT
exports.isAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// isAdmin: only admin access
exports.isAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const admin = await Admin.findById(req.user.id);
  if (!admin || req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });
  next();
};

// isUser: only user access
exports.isUser = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const user = await User.findById(req.user.id);
  if (!user || req.user.role !== 'user') return res.status(403).json({ success: false, message: 'User only' });
  next();
};
