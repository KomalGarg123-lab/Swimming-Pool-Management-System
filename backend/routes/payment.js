const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuth, isUser } = require('../middleware/auth');

router.post('/create-order', isAuth, isUser, paymentController.createOrder);
router.post('/verify', isAuth, isUser, paymentController.verifyPayment);

module.exports = router;
