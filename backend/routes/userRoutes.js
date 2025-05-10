const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  registerUser,
  loginUser,
  verifyUser,
  checkUser,
} = require("../controllers/userController");

// Register, login, verify routes
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyUser);

// Check if a user exists by email (no auth required)
router.get("/check", checkUser);

// Example: Get user by ID (no auth middleware for this route)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
