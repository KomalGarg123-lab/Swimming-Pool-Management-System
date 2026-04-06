const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { isAuth, isAdmin } = require('../middleware/auth');

router.post('/', isAuth, isAdmin, scanController.scanQR);

module.exports = router;
