const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Group = require("../models/Group");
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

// Send a message to a group
exports.sendGroupMessage = async (req, res) => {
  try {
    const { groupId, content, messageType = 'text', mediaUrl } = req.body;
    const senderId = req.user._id;

    // Validate input
    if (!content && !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'Message content or media is required'
      });
    }

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member of the group
    const isMember = group.members.some(member => 
      member.user.toString() === senderId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Create and save the message
    const newMessage = new Message({
      sender: senderId,
      groupId,
      content,
      messageType,
      mediaUrl,
      readBy: [{ user: senderId }] // Sender has read the message
    });

    await newMessage.save();

    // Populate sender info and return
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email')
      .populate('readBy.user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });

    // In a real app, you would emit this message via WebSockets
    // socketIo.to(groupId).emit('newGroupMessage', populatedMessage);
    
  } catch (error) {
    console.error('Send group message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send group message'
    });
  }
};

// Get messages for a group
exports.getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;
    const { page = 1, limit = 50 } = req.query;

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member of the group
    const isMember = group.members.some(member => 
      member.user.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Get paginated messages
    const messages = await Message.find({ groupId })
      .populate('sender', 'name email')
      .populate('readBy.user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Get total count
    const totalMessages = await Message.countDocuments({ groupId });

    res.status(200).json({
      success: true,
      data: {
        messages,
        totalPages: Math.ceil(totalMessages / limit),
        currentPage: Number(page)
      }
    });
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve group messages'
    });
  }
};

// Mark group messages as read
exports.markGroupMessagesAsRead = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member of the group
    const isMember = group.members.some(member => 
      member.user.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Find unread messages
    const unreadMessages = await Message.find({
      groupId,
      'readBy.user': { $ne: userId }
    });

    // Update each message
    for (const message of unreadMessages) {
      message.readBy.push({ user: userId });
      await message.save();
    }

    res.status(200).json({
      success: true,
      message: `Marked ${unreadMessages.length} messages as read`
    });
  } catch (error) {
    console.error('Mark group messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
};

/**
 * Get offline messages for the current user (both direct and group messages)
 */
exports.getOfflineMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find direct chat messages first (existing functionality)
    const chats = await Chat.find({
      participants: userId
    });
    
    const chatIds = chats.map(chat => chat._id);

    // Get direct messages that haven't been read by the user
    const directMessages = await Message.find({
      chatId: { $in: chatIds },
      sender: { $ne: userId }, // Not sent by current user
      'readBy.user': { $ne: userId } // Not read by current user
    })
    .populate('sender', 'name email')
    .populate('chatId', 'participants')
    .sort({ createdAt: -1 });

    // Return direct messages - this preserves existing functionality
    return res.status(200).json({
      success: true,
      data: directMessages
    });
    
  } catch (error) {
    console.error('Get offline messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve offline messages',
      error: error.message
    });
  }
};
