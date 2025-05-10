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

    // Find the target user by email
    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent chatting with oneself
    if (targetUser._id.toString() === currentUserId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    // Check if a chat already exists between the current user and the target user
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [currentUserId, targetUser._id] },
    }).populate("participants", "name email phone avatar");

    // If no chat exists, create a new one
    if (!chat) {
      chat = await Chat.create({
        participants: [currentUserId, targetUser._id],
      });

      // Populate the participants' details
      chat = await Chat.findById(chat._id).populate(
        "participants",
        "name email phone avatar"
      );
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("❌ Error accessing/creating chat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📨 Fetch all chats for the current user

exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all chats where the current user is a participant
    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name email avatar") // Include participant details
      .populate("lastMessage", "content sender createdAt") // Include last message details
      .sort({ updatedAt: -1 }); // Sort by most recently updated

    res.status(200).json(chats);
  } catch (err) {
    console.error("❌ Error fetching user chats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};