const socketHandler = (io) => {
  const userSockets = new Map(); // Map to store userId -> socketId
  const Message = require("./models/Message");

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.error("Authentication error: Missing userId");
      return;
    }

    userSockets.set(userId, socket.id);
    console.log(`🔌 User connected: ${socket.id}, User: ${userId}`);

    socket.on("startCall", ({ callType, participants, caller }) => {
      console.log(`📞 Call started by ${caller.name} (${caller.socketId})`);
      console.log(`Call type: ${callType}`);
      console.log(`Participants:`, participants);

      participants.forEach((participant) => {
        const recipientSocketId = userSockets.get(participant._id.toString());
        if (recipientSocketId) {
          console.log(`Emitting callIncoming to ${participant.name} (${recipientSocketId})`);
          io.to(recipientSocketId).emit("callIncoming", { callType, caller });
        } else {
          console.warn(`Socket ID missing for participant: ${participant.name}`);
        }
      });
    });

    // Handle message delivered
    socket.on("message:delivered", async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;
        // Check if already delivered
        if (!message.deliveredTo.some(entry => entry.user.toString() === userId)) {
          message.deliveredTo.push({ user: userId, deliveredAt: new Date() });
          // For direct messages, update status to 'delivered' if not already 'read'
          if (message.chatId && !message.groupId && message.status !== "read") {
            message.status = "delivered";
          }
          await message.save();
        }
        // Notify sender
        const senderSocketId = userSockets.get(message.sender.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit("message:delivered:update", { messageId, userId });
        }
      } catch (err) {
        console.error("Error in message:delivered", err);
      }
    });

    // Handle message read
    socket.on("message:read", async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;
        // Check if already read
        if (!message.readBy.some(entry => entry.user.toString() === userId)) {
          message.readBy.push({ user: userId, readAt: new Date() });
          // For direct messages, update status to 'read'
          if (message.chatId && !message.groupId) {
            message.status = "read";
          }
          await message.save();
        }
        // Notify sender
        const senderSocketId = userSockets.get(message.sender.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit("message:read:update", { messageId, userId });
        }
      } catch (err) {
        console.error("Error in message:read", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`👋 User disconnected: ${socket.id}, User: ${userId}`);
      userSockets.delete(userId);
    });
  });
};

module.exports = socketHandler;