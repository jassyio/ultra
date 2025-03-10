const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: true, // Temporary fix for SSL issues
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

// WebSocket Server Setup
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🟢 New WebSocket connection");

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());

    // Broadcast message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("🔴 WebSocket disconnected");
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("⚠️ Global Error Handler:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
