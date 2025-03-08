const express = require("express");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 📝 GET ALL CHATS (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find();
    res.status(200).json(chats);
  } catch (err) {
    console.error("❌ Error fetching chats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📝 CREATE A CHAT (Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const chat = new Chat({ senderId, receiverId, message });
    await chat.save();

    res.status(201).json({ message: "✅ Chat created successfully", chat });
  } catch (err) {
    console.error("❌ Error creating chat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
