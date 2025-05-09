const express = require("express");
const {
  register,
  verifyOTP,
  login,
  resendOTP
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Public Auth Routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);

// Authenticated User Routes
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Fetch Users Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/users/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Fetch User by ID Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
