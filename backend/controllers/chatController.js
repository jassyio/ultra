const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

// 📩 Start or get a one-on-one chat by email
exports.accessOrCreateChatByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUserId = req.user.id;

    const otherUser = await User.findOne({ email });
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for existing chat
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, otherUser._id], $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({ participants: [currentUserId, otherUser._id] });
    }

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error in accessOrCreateChatByEmail:", error);
    res.status(500).json({ message: "Could not start chat", error: error.message });
  }
};

// 📨 Fetch all chats for the current user, including last message
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage", "content sender createdAt")
      .sort({ updatedAt: -1 }); // Most recent first

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Mark all messages in a chat as read by the current user
exports.markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    // Update all messages in the chat that haven't been read by this user
    await Message.updateMany(
      { chatId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId }, status: "read" }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    console.error("❌ Error marking messages as read:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};