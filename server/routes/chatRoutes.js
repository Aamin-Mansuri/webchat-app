const express = require('express');
const router = express.Router();

// 1. Import authentication middleware
const { isAuthenticated } = require('../middleware/auth');

// 2. Import controller functions (Ensure names match exactly!)
const { accessChat, fetchChats } = require('../controllers/chatController');

// 3. Define Routes
// Line 7 is usually this one:
router.post('/', isAuthenticated, accessChat); 

router.get('/', isAuthenticated, fetchChats);

module.exports = router;