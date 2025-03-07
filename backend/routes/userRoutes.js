const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware

const router = express.Router();

// Get all users (Protected Route)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
