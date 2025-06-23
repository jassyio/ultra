const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware"); // Add this import

// Protect all message routes
router.use(authMiddleware);

// Send a new message
router.post('/send', messageController.sendMessage);

// Get undelivered (offline) messages for the current user
router.get('/offline', messageController.getUndeliveredMessages);

// Get all messages for a chat
router.get('/:chatId', messageController.getMessagesByChat);

// Mark all messages in a chat as read
router.patch('/:chatId/read', messageController.markMessagesAsRead);

// Group message routes
router.post('/group', authMiddleware, messageController.sendGroupMessage);
router.get('/group/:groupId', authMiddleware, messageController.getGroupMessages);
router.post('/group/:groupId/read', authMiddleware, messageController.markGroupMessagesAsRead);

module.exports = router;
