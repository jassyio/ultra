const express = require("express");
const Chat = require("../models/Chat");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📝 CREATE A NEW CHAT
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { message, recipientId } = req.body;

        const newChat = new Chat({
            sender: req.user,
            recipient: recipientId,
            message,
        });

        await newChat.save();
        res.status(201).json(newChat);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📝 GET CHATS BETWEEN TWO USERS
router.get("/:recipientId", authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [
                { sender: req.user, recipient: req.params.recipientId },
                { sender: req.params.recipientId, recipient: req.user },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
