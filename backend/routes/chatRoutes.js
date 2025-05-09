const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  accessOrCreateChatByEmail,
  getUserChats,
} = require("../controllers/chatController");

// 🌐 Get all chats for the authenticated user
router.get("/", authMiddleware, getUserChats);

// ✉️ Start a new chat with a user by email
router.post("/start", authMiddleware, accessOrCreateChatByEmail);

module.exports = router;
