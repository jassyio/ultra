const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

// Protect all message routes
router.use(auth);

// Send a new message
router.post('/send', messageController.sendMessage);

// Get undelivered (offline) messages for the current user
router.get('/offline', messageController.getUndeliveredMessages);

// Get all messages for a chat
router.get('/:chatId', messageController.getMessagesByChat);

// Mark all messages in a chat as read
router.patch('/:chatId/read', messageController.markMessagesAsRead);

module.exports = router;
