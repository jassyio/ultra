const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyUser,
  checkUser, // <- import the function here
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Register, login, verify routes
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyUser);

// 🔄 IMPORTANT: Place checkUser route BEFORE /:id to avoid conflicts
router.get("/check", authMiddleware, checkUser);

// Example user fetch by ID
router.get("/:id", authMiddleware, async (req, res) => {
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
