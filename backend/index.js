const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const socketHandler = require("./socket");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const groupRoutes = require("./routes/groupRoutes"); // Import groupRoutes
const Chat = require("./models/Chat");
const Message = require("./models/Message"); // Import Message model
const User = require("./models/User"); // Import User model
const Group = require("./models/Group"); // Import Group model

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "http://localhost:3001", // Local backend
  "https://ultra-frontend-zeta.vercel.app", // Hosted frontend
  "https://ultra-frontend-git-main-jassyios-projects.vercel.app", // Another hosted frontend
  "https://ultra-3il5.onrender.com", // Production deployment
  "https://ultra-frontend.vercel.app" // Main Vercel domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes); // Use groupRoutes

app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully!");
});

const io = socketIO(server, {
  cors: {
    origin: allowedOrigins, // Use the same allowedOrigins array
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies and authentication headers
  },
});

socketHandler(io);

let userSockets = new Map();
let socketUsers = new Map();

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error("Authentication error"));
  }
  socket.userId = userId;
  next();
});

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    console.error("Authentication error: Missing userId");
    return;
  }

  userSockets.set(userId, socket.id);
  socketUsers.set(socket.id, userId);

  console.log(`🔌 Client connected - Socket: ${socket.id}, User: ${userId}`);

  socket.on("disconnect", () => {
    console.log(`👋 Client disconnected - Socket: ${socket.id}, User: ${userId}`);
    userSockets.delete(userId);
    socketUsers.delete(socket.id);
  });

  // Handle call initiation
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

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`🚪 User ${userId} joined room: ${chatId}`);
    const room = io.sockets.adapter.rooms.get(chatId);
    const members = room ? Array.from(room) : [];
    console.log(`Room ${chatId} members:`, members);
    socket.emit("roomJoined", {
      chatId,
      members: members.map((socketId) => socketUsers.get(socketId)).filter(Boolean),
    });
  });

  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
    console.log(`🚶 User ${userId} left room: ${chatId}`);
  });

  socket.on("typing", (data) => {
    console.log(`✍️ User ${userId} typing in chat ${data.chatId}`);
    socket.to(data.chatId).emit("typing", {
      ...data,
      sender: userId,
    });
  });

  socket.on("sendMessage", async (message) => {
    try {
      console.log(`📨 Message from user ${userId} in chat ${message.chatId}: ${message.content}`);

      // Validate input
      if (!message.content?.trim() || !message.chatId || !message.sender) {
        throw new Error("Missing required fields: content, chatId, or sender");
      }
      if (message.sender !== userId) {
        throw new Error("Invalid sender ID");
      }

      // Join room if not already joined
      const room = io.sockets.adapter.rooms.get(message.chatId);
      if (!room || !room.has(socket.id)) {
        console.log("🔄 User not in room, joining now...");
        await socket.join(message.chatId);
      }

      // Save message to DB
      const savedMessage = await Message.create({
        sender: userId,
        content: message.content.trim(),
        chatId: message.chatId,
        status: ["sent", "delivered", "read"].includes(message.status)
          ? message.status
          : "sent",
      });

      // Log when message is saved
      console.log(`💾 Message saved: ${savedMessage._id} by user ${userId} in chat ${message.chatId}`);

      // Prepare message data for emission
      const messageData = {
        _id: savedMessage._id,
        sender: userId,
        content: savedMessage.content,
        chatId: savedMessage.chatId,
        status: savedMessage.status,
        createdAt: savedMessage.createdAt
      };

      // Send confirmation to sender
      socket.emit("messageSent", messageData);

      // Broadcast to others in the room
      socket.to(message.chatId).emit("receiveMessage", messageData);

      // Deliver to individual participants (for one-on-one chats)
      const chatDoc = await Chat.findById(message.chatId).populate("participants", "_id");
      if (chatDoc) {
        chatDoc.participants.forEach(participant => {
          if (participant._id.toString() !== userId) {
            const recipientSocketId = userSockets.get(participant._id.toString());
            if (recipientSocketId) {
              io.to(recipientSocketId).emit("receiveMessage", messageData);
            }
          }
        });
      }

      // Log delivery status
      const roomAfterSend = io.sockets.adapter.rooms.get(message.chatId);
      if (roomAfterSend) {
        console.log(`Message ${messageData._id} delivered to room ${message.chatId}`);
      }

    } catch (error) {
      console.error("❌ Error handling message:", {
        error: error.message,
        stack: error.stack,
        attemptedData: message
      });
      socket.emit("messageError", {
        error: error.message,
        originalMessage: message
      });
    }
  });

  // Group chat socket events
  socket.on("joinGroupRoom", (groupId) => {
    const roomId = `group:${groupId}`;
    socket.join(roomId);
    console.log(`🚪 User ${userId} joined group room: ${roomId}`);
  });

  socket.on("leaveGroupRoom", (groupId) => {
    socket.leave(`group:${groupId}`);
    console.log(`🚶 User ${userId} left group room: group:${groupId}`);
  });

  socket.on("sendGroupMessage", async (message) => {
    try {
      console.log(`📨 Group message from ${userId} in group ${message.groupId}: ${message.content}`);

      // Validate input
      if (!message.content?.trim() || !message.groupId || !message.sender) {
        throw new Error("Missing required fields: content, groupId, or sender");
      }

      if (message.sender !== userId) {
        throw new Error("Invalid sender ID");
      }

      // Join room if not already joined
      const roomId = `group:${message.groupId}`;
      socket.join(roomId);

      // Save message to DB (using the updated Message model that supports group messages)
      const newMessage = new Message({
        sender: userId,
        content: message.content.trim(),
        groupId: message.groupId,
        messageType: message.messageType || 'text',
        mediaUrl: message.mediaUrl || null,
        readBy: [{ user: userId }] // Sender has read the message
      });

      const savedMessage = await newMessage.save();

      // Populate sender info
      await savedMessage.populate('sender', 'name email');

      console.log(`💾 Group message saved: ${savedMessage._id}`);

      // Emit to everyone in the group including sender (for confirmation)
      io.to(roomId).emit("newGroupMessage", {
        _id: savedMessage._id,
        sender: savedMessage.sender,
        content: savedMessage.content,
        groupId: savedMessage.groupId,
        messageType: savedMessage.messageType,
        mediaUrl: savedMessage.mediaUrl,
        readBy: savedMessage.readBy,
        createdAt: savedMessage.createdAt
      });

    } catch (error) {
      console.error("❌ Error handling group message:", error);
      socket.emit("groupMessageError", {
        error: error.message,
        originalMessage: message
      });
    }
  });

  socket.on("typingInGroup", (data) => {
    console.log(`✍️ User ${userId} typing in group ${data.groupId}`);
    const groupRoomId = `group:${data.groupId}`;
    socket.to(groupRoomId).emit("typingInGroup", {
      ...data,
      sender: userId
    });
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

