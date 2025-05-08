const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://your-frontend.vercel.app", // Replace with your deployed URL
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

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsAllowInvalidCertificates: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully!");
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

let onlineUsers = {}; // Track users who are online

// When a user connects
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // User connects, send online status
  socket.on("userOnline", (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit("userOnline", userId); // Notify everyone that the user is online
    console.log(`${userId} is online.`);
  });

  // User disconnects
  socket.on("disconnect", () => {
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        io.emit("userOffline", userId); // Notify everyone that the user is offline
        console.log(`${userId} is offline.`);
        break;
      }
    }
  });

  // Typing status
  socket.on("typing", (data) => {
    // Broadcast typing status to the recipient
    io.emit("typing", data); // data includes { userId, chatId }
  });

  // Handle private messaging
  socket.on("sendMessage", (message) => {
    const { recipientId } = message; // Assuming message has recipientId for private messaging

    if (onlineUsers[recipientId]) {
      // Send message to the specific recipient
      io.to(onlineUsers[recipientId]).emit("receiveMessage", message);
    } else {
      console.log(`User ${recipientId} is offline. Message not delivered.`);
    }
  });

  // Handle user status request (to get the list of online users)
  socket.on("getOnlineUsers", () => {
    socket.emit("onlineUsers", Object.keys(onlineUsers)); // Send a list of online users to the requesting user
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
