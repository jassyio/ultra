const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");

const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// ✅ CORS Configuration
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || ["*"], credentials: true }));
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { tlsAllowInvalidCertificates: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully!");
});

// ✅ Error Handling
app.use((err, req, res, next) => {
  console.error("⚠️ Global Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
