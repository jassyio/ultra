const express = require("express");
const {
  register,
  verifyOTP,
  login,
  resendOTP
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // Import JWT for token generation
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const router = express.Router();

// Public Auth Routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Send the token and user data in the response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
