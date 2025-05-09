const Chat = require("../models/Chat");
const User = require("../models/User");

// 📩 Start or get a one-on-one chat by email
exports.accessOrCreateChatByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUserId = req.user.id;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === currentUserId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    // Check if a chat already exists between the two users
    let chat = await Chat.findOne({
      isGroupChat: false,
      members: { $all: [currentUserId, targetUser._id] },
    }).populate("members", "name email phone");

    // If chat doesn't exist, create one
    if (!chat) {
      chat = await Chat.create({
        members: [currentUserId, targetUser._id],
      });

      chat = await Chat.findById(chat._id).populate("members", "name email phone");
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("❌ Error accessing/creating chat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all chats for the logged-in user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      members: userId,
    })
      .populate("members", "name email phone")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error("❌ Error fetching user chats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
