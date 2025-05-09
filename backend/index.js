// === server.js ===
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Add this line

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app",
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
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // ✅ Mount the userRoutes correctly

app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully!");
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on("userOnline", (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit("userOnline", userId);
  });

  socket.on("disconnect", () => {
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        io.emit("userOffline", userId);
        break;
      }
    }
  });

  socket.on("typing", (data) => {
    io.emit("typing", data);
  });

  socket.on("sendMessage", (message) => {
    const { recipientId } = message;
    if (onlineUsers[recipientId]) {
      io.to(onlineUsers[recipientId]).emit("receiveMessage", message);
    }
  });

  socket.on("getOnlineUsers", () => {
    socket.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
