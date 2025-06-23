// File: backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");

// POST /api/chats - Create a new chat
router.post("/", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: "Invalid user ID provided",
        details: { userId }
      });
    }

    // Verify target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ 
        message: "Target user not found",
        details: { userId }
      });
    }

    // Prevent self-chat
    if (userId === req.user.id) {
      return res.status(400).json({ 
        message: "Cannot create chat with yourself",
        details: { userId, currentUser: req.user.id }
      });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { 
        $all: [req.user.id, userId],
        $size: 2
      }
    }).populate("participants", "name email avatar");

    if (existingChat) {
      // Filter out current user from participants
      const otherParticipant = existingChat.participants.find(p => p._id.toString() !== req.user.id);
      existingChat.participants = [otherParticipant];
      return res.json(existingChat);
    }

    // Create new chat
    const chat = new Chat({
      participants: [req.user.id, userId]
    });

    const savedChat = await chat.save();
    const populatedChat = await savedChat.populate("participants", "name email avatar");
    
    // Filter out current user from participants
    const otherParticipant = populatedChat.participants.find(p => p._id.toString() !== req.user.id);
    populatedChat.participants = [otherParticipant];

    res.status(201).json(populatedChat);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ 
      message: "Failed to create chat",
      details: err.message
    });
  }
});

// GET /api/chats - Get all chats for the current user
router.get("/", auth, chatController.getChats);

// GET /api/chats/:chatId - Get a specific chat
router.get("/:chatId", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user.id
    })
    .populate("participants", "name email avatar")
    .populate("messages");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Filter out current user from participants
    const otherParticipant = chat.participants.find(p => p._id.toString() !== req.user.id);
    chat.participants = [otherParticipant];

    res.json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ 
      message: "Failed to fetch chat",
      details: err.message
    });
  }
});

// POST /api/chats/:chatId/messages - Add a message to a chat
router.post("/:chatId/messages", auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = {
      sender: req.user.id,
      content: content.trim(),
      createdAt: new Date()
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.save();

    res.status(201).json(message);
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({ 
      message: "Failed to add message",
      details: err.message
    });
  }
});

module.exports = router;
