const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Group = require("../models/Group");

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
    let chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage", "content sender createdAt")
      .sort({ updatedAt: -1 });

    // Fix chats with missing lastMessage
    for (let chat of chats) {
      if (!chat.lastMessage) {
        const lastMsg = await Message.findOne({ chatId: chat._id })
          .sort({ createdAt: -1 });
        if (lastMsg) {
          chat.lastMessage = lastMsg;
          // Optionally update the Chat document in DB
          await Chat.findByIdAndUpdate(chat._id, { lastMessage: lastMsg._id });
        }
      }
    }

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

exports.getChats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Direct chats
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .sort({ updatedAt: -1 });

    const chatList = await Promise.all(chats.map(async (chat) => {
      // Get latest message
      const lastMessage = await Message.findOne({ chatId: chat._id })
        .sort({ createdAt: -1 })
        .populate("sender", "name email avatar");

      // Count unread messages
      const unreadCount = await Message.countDocuments({
        chatId: chat._id,
        sender: { $ne: userId },
        "readBy.user": { $ne: userId }
      });

      return {
        ...chat.toObject(),
        lastMessage,
        unreadCount
      };
    }));

    // Groups
    const groups = await Group.find({ "members.user": userId })
      .populate("members.user", "name email avatar")
      .sort({ updatedAt: -1 });

    const groupList = await Promise.all(groups.map(async (group) => {
      // Get latest message
      const lastMessage = await Message.findOne({ groupId: group._id })
        .sort({ createdAt: -1 })
        .populate("sender", "name email avatar");

      if (!lastMessage) {
        console.log(`No lastMessage found for group ${group.name} (${group._id})`);
      }

      // Count unread messages
      const unreadCount = await Message.countDocuments({
        groupId: group._id,
        sender: { $ne: userId },
        "readBy.user": { $ne: userId }
      });

      return {
        ...group.toObject(),
        lastMessage,
        unreadCount
      };
    }));

    const combined = [...chatList, ...groupList];

    res.json(combined);
  } catch (err) {
    console.error("❌ Error in getChats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};