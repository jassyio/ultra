const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User"); // Import the User model
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

  app.get("/api", (req, res) => {
    res.send("Backend is running");
  });

// POST /api/users - Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    console.log("User created:", newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/users - Fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    console.log("Users fetched from MongoDB:", users);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});