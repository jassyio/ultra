const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",  // Local frontend dev
  "https://your-frontend.vercel.app",  // Replace with your deployed frontend URL
];

// ✅ CORS Setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies, headers, etc.
}));

// ✅ Middleware
app.use(express.json()); // To parse JSON bodies

// ✅ MongoDB Connection
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

// ✅ Routes
app.use("/api/auth", authRoutes); // /api/auth/register, /login, etc.

// ✅ Root Route (Ping Test)
app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully!");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("⚠️ Global Error:", err.message || err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start the Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
