const Subscription = require('../models/Subscription');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const FamilyMember = require('../models/FamilyMember');
const jwt = require('jsonwebtoken');

const sendRes = (res, success, message, data = {}) => {
  res.json({ success, message, data });
};

// POST /api/subscription/create
exports.createSubscription = async (req, res) => {
  try {
    const { memberId, planId } = req.body;
    if (!memberId || !planId) return sendRes(res, false, 'All fields required');
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return sendRes(res, false, 'Invalid plan');
    const member = await FamilyMember.findById(memberId);
    if (!member) return sendRes(res, false, 'Invalid member');
    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    // QR Token
    const qrToken = jwt.sign({ memberId, planId, expiresAt: endDate }, process.env.QR_SECRET, { expiresIn: plan.durationDays + 'd' });
    // Create subscription
    const subscription = await Subscription.create({
      memberId,
      planId,
      startDate,
      endDate,
      status: 'active',
      qrToken
    });
    sendRes(res, true, 'Subscription created', { subscription });
  } catch (err) {
    sendRes(res, false, 'Create subscription failed', { error: err.message });
  }
};

// GET /api/subscription/user
exports.getUserSubscriptions = async (req, res) => {
  try {
    // Find all family members for this user
    const FamilyMember = require('../models/FamilyMember');
    const members = await FamilyMember.find({ userId: req.user.id });
    const memberIds = members.map(m => m._id);
    const subscriptions = await Subscription.find({ memberId: { $in: memberIds } }).populate('planId').populate('memberId');
    sendRes(res, true, 'User subscriptions fetched', { subscriptions });
  } catch (err) {
    sendRes(res, false, 'Fetch subscriptions failed', { error: err.message });
  }
};
