const Chat = require("../models/Chat");
const User = require("../models/User");

exports.createChat = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({ participants: { $all: [userId1, userId2] } });

    if (!chat) {
      chat = new Chat({ participants: [userId1, userId2] });
      await chat.save();
    }

    res.status(201).json(chat);
  } catch (err) {
    console.error("Create Chat Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ participants: userId }).populate("participants", "name email");

    res.json(chats);
  } catch (err) {
    console.error("Get Chats Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
