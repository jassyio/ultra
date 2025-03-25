const Chat = require("../models/Chat");
const User = require("../models/User");
const { encryptMessage, decryptMessage } = require("../utils/encryption");
const { io } = require("../server"); // WebSocket

/** ==========================
 *  ✅ Send Message (E2EE Ready)
 *  ========================== */
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Encrypt Message (End-to-End Encryption)
    const encryptedMessage = encryptMessage(message);

    // Save Message
    const newMessage = await Chat.create({
      sender,
      receiver,
      message: encryptedMessage, // Stored as encrypted text
      status: "sent",
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

    let messages = await Chat.find({
      $or: [
        { sender: userId, receiver: chatWith },
        { sender: chatWith, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    // Decrypt messages before sending
    messages = messages.map((msg) => ({
      ...msg._doc,
      message: decryptMessage(msg.message),
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

    const updatedMessage = await Chat.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    res.status(200).json({ message: "Status updated", data: updatedMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
