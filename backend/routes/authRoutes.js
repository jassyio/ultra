const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs"); // To hash passwords
const jwt = require("jsonwebtoken");

const router = express.Router();

// POST /api/signup - Create a new user
router.post('/signup', async (req, res) => {
    try {
      const { name, email, password, username } = req.body;
      const newUser = new User({ name, email, password, username });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

// 📝 LOGIN - Authenticate User with JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
