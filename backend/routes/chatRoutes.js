const express = require("express");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/** ==============================
 *  ✅ GET ALL CHATS FOR A USER
 *  ============================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch chats where the user is either sender or receiver
    const chats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver", "name phone");

    res.status(200).json(chats);
  } catch (err) {
    console.error("❌ Error fetching chats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** ==============================
 *  ✅ SEND A CHAT MESSAGE
 *  ============================== */
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const sender = req.user.id;

    if (!receiver || !message) {
      return res.status(400).json({ message: "Receiver and message are required" });
    }

    const chat = new Chat({ sender, receiver, message });
    await chat.save();

    res.status(201).json({ message: "✅ Message sent successfully", chat });
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** ==============================
 *  ✅ DELETE A CHAT MESSAGE
 *  ============================== */
router.delete("/:chatId", authMiddleware, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (chat.sender.toString() !== userId && chat.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this chat" });
    }

    await chat.deleteOne();
    res.status(200).json({ message: "✅ Chat deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting chat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
