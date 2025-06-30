const socketHandler = (io) => {
  const userSockets = new Map(); // Map to store userId -> socketId

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

    socket.on("disconnect", () => {
      console.log(`👋 User disconnected: ${socket.id}, User: ${userId}`);
      userSockets.delete(userId);
    });
  });
};

module.exports = socketHandler;