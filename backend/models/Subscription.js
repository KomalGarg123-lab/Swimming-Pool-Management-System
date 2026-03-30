const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember', required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'suspended'], default: 'active' },
  qrToken: { type: String, required: true, unique: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
