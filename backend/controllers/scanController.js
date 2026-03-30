const jwt = require('jsonwebtoken');
const Subscription = require('../models/Subscription');
const FamilyMember = require('../models/FamilyMember');
const EntryLog = require('../models/EntryLog');
const Admin = require('../models/Admin');

const sendRes = (res, success, message, data = {}) => {
  res.json({ success, message, data });
};

// Prevent duplicate scan: block same QR within 10 seconds
const recentScans = new Map(); // qrToken: timestamp

exports.scanQR = async (req, res) => {
  try {
    const { qrToken } = req.body;
    if (!qrToken) return sendRes(res, false, 'QR token required');
    // Check duplicate scan
    const now = Date.now();
    if (recentScans.has(qrToken) && now - recentScans.get(qrToken) < 10000) {
      return sendRes(res, false, 'Duplicate scan detected');
    }
    // Verify QR token
    let payload;
    try {
      payload = jwt.verify(qrToken, process.env.QR_SECRET);
    } catch (err) {
      return sendRes(res, false, 'Invalid or expired QR');
    }
    // Find subscription
    const subscription = await Subscription.findOne({ qrToken });
    if (!subscription) return sendRes(res, false, 'Subscription not found');
    if (subscription.status !== 'active') return sendRes(res, false, 'Subscription not active');
    // Check expiry
    if (new Date(subscription.endDate) < new Date()) {
      subscription.status = 'expired';
      await subscription.save();
      return sendRes(res, false, 'Subscription expired');
    }
    // Prevent duplicate scan (timestamp check)
    recentScans.set(qrToken, now);
    setTimeout(() => recentScans.delete(qrToken), 10000);
    // Get member details
    const member = await FamilyMember.findById(subscription.memberId);
    if (!member) return sendRes(res, false, 'Member not found');
    // Save entry log
    await EntryLog.create({
      memberId: member._id,
      scannedAt: new Date(),
      scannedByAdmin: req.user.id
    });
    sendRes(res, true, 'Entry allowed', { valid: true, member });
  } catch (err) {
    sendRes(res, false, 'Scan failed', { error: err.message });
  }
};
