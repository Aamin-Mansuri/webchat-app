const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { sendMessage, allMessages } = require('../controllers/messageController');
const upload = require('../middleware/multer'); // Ensure you have this file

// Use 'upload.single' to catch the file from the frontend FormData
router.post('/', isAuthenticated, upload.single('file'), sendMessage);
router.get('/:chatId', isAuthenticated, allMessages);

module.exports = router;