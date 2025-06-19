const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");
const { encryptMessage, decryptMessage } = require("../utils/encryption");


/** ==========================
 *  ✅ Send Message (E2EE Ready)
 *  ========================== */
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, sender, receiver, message } = req.body;

    if (!chatId || !sender || !receiver || !message) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    // Encrypt Message (End-to-End Encryption)
    const encryptedMessage = encryptMessage(message);

    // Save Message
    const newMessage = await Message.create({
      chatId,
      sender,
      receiver,
      content: encryptedMessage, // Stored as encrypted text
      status: "sent",
      readBy: [sender], // sender has read their own message
    });

    // Update chat's lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: newMessage._id,
      updatedAt: new Date(),
    });

    // Emit message to receiver via WebSocket
    io.to(receiver).emit("newMessage", newMessage);

    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ==========================
 *  ✅ Get User Messages (Decryption)
 *  ========================== */
exports.getMessages = async (req, res) => {
  try {
    const { userId, chatWith } = req.params;

    if (!userId || !chatWith) {
      return res.status(400).json({ message: "User ID and chat ID required" });
    }

    let messages = await Message.find({
      $or: [
        { sender: userId, receiver: chatWith },
        { sender: chatWith, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    // Decrypt messages before sending
    messages = messages.map((msg) => ({
      ...msg._doc,
      content: decryptMessage(msg.content),
    }));

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ==========================
 *  ✅ Update Message Status (Read, Delivered)
 *  ========================== */
exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId, status } = req.body;

    if (!messageId || !status) {
      return res.status(400).json({ message: "Message ID and status required" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    res.status(200).json({ message: "Status updated", data: updatedMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all messages for a chat
exports.getMessagesByChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) return res.status(400).json({ message: "chatId required" });

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email avatar");

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get undelivered messages for a user (sent while offline)
exports.getUndeliveredMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ participants: userId }).select("_id");
    const chatIds = chats.map(c => c._id);

    const messages = await Message.find({
      chatId: { $in: chatIds },
      sender: { $ne: userId },
      status: "sent",
      readBy: { $ne: userId }
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Mark messages as read in a chat
exports.markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    await Message.updateMany(
      { chatId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId }, status: "read" }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    let chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage", "content sender createdAt")
      .sort({ updatedAt: -1 });

    // Decrypt lastMessage content if present
    chats = chats.map(chat => {
      if (chat.lastMessage && chat.lastMessage.content) {
        chat.lastMessage.content = decryptMessage(chat.lastMessage.content);
      }
      return chat;
    });

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
