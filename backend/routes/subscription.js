const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { isAuth, isUser } = require('../middleware/auth');

router.post('/create', isAuth, isUser, subscriptionController.createSubscription);
router.get('/user', isAuth, isUser, subscriptionController.getUserSubscriptions);

module.exports = router;
