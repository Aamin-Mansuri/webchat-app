const express = require('express');
const { updateProfile, blockUser ,removeAvatar} = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/multer');
const router = express.Router();
const { searchUsers, getMe } = require('../controllers/userController');

router.get('/me', isAuthenticated, getMe);
router.get('/search', isAuthenticated, searchUsers);
router.put('/update', isAuthenticated, upload.single('avatar'), updateProfile);
router.put('/block/:id', isAuthenticated, blockUser);
router.delete('/remove-avatar', isAuthenticated, removeAvatar);

module.exports = router;
