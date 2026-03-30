const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { isAuth, isUser } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Use multer for image upload
router.post('/', isAuth, isUser, upload.single('photo'), memberController.addMember);
router.get('/', isAuth, isUser, memberController.getMembers);

module.exports = router;
