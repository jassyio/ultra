// File: backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();

// const auth = require("../middleware/authMiddleware");

// POST /api/chats
router.post("/", /*auth,*/ async (req, res) => {
  try {
    const { userId } = req.body;
    // TODO: Insert your Chat model logic here
    // const chat = await Chat.create({ participants: [req.user.id, userId] });
    res.status(201).json({ success: true /*, chat */ });
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/chats
router.get("/", /*auth,*/ async (req, res) => {
  try {
    // TODO: fetch chats for req.user.id
    // const chats = await Chat.find({ participants: req.user.id });
    res.json([] /*chats*/);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
