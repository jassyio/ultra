const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
// 📝 GET USER PROFILE (Protected Route)
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📝 SIGNUP - Create a New User
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        // Check if email or username already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
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

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
