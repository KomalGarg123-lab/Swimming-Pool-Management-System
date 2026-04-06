const Razorpay = require('razorpay');
const crypto = require('crypto');
const SubscriptionPlan = require('../models/SubscriptionPlan');

const sendRes = (res, success, message, data = {}) => {
  res.json({ success, message, data });
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) return sendRes(res, false, 'Plan ID required');
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return sendRes(res, false, 'Invalid plan');
    const amount = plan.pricing * 100; // INR to paise
    const options = {
      amount,
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    sendRes(res, true, 'Order created', { order });
  } catch (err) {
    sendRes(res, false, 'Create order failed', { error: err.message });
  }
};

// POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return sendRes(res, false, 'Missing payment details');
    }
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');
    if (expectedSignature !== razorpay_signature) {
      return sendRes(res, false, 'Invalid payment signature');
    }
    sendRes(res, true, 'Payment verified');
  } catch (err) {
    sendRes(res, false, 'Payment verification failed', { error: err.message });
  }
};
