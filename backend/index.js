const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Chat = require("./models/Chat");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "ultra-backend.vercel.app ",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully!");
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

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
  const userId = socket.userId;
  console.log(`🔌 Client connected - Socket: ${socket.id}, User: ${userId}`);

  userSockets.set(userId, socket.id);
  socketUsers.set(socket.id, userId);

  socket.broadcast.emit("userOnline", userId);

  socket.on("disconnect", () => {
    console.log(`👋 Client disconnected - Socket: ${socket.id}, User: ${userId}`);
    userSockets.delete(userId);
    socketUsers.delete(socket.id);
    socket.broadcast.emit("userOffline", userId);
  });

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`🚪 User ${userId} joined room: ${chatId}`);
    const room = io.sockets.adapter.rooms.get(chatId);
    const members = room ? Array.from(room) : [];
    console.log(`Room ${chatId} members:`, members);
    socket.emit("roomJoined", {
      chatId,
      members: members.map(socketId => socketUsers.get(socketId)).filter(Boolean)
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
      sender: userId
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

      // Prepare message data for emission (no DB save)
      const messageData = {
        _id: Date.now().toString(), // Temporary unique ID
        sender: userId,
        content: message.content.trim(),
        chatId: message.chatId,
        status: ["sent", "delivered", "read"].includes(message.status) 
          ? message.status 
          : "sent",
        createdAt: new Date().toISOString()
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
});

mongoose.connect(process.env.MONGO_URI, {
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