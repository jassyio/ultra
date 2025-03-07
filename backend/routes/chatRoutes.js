const express = require("express");

const router = express.Router();

// Example route - Get all chats (Modify as needed)
router.get("/", (req, res) => {
  res.json({ message: "Chats route working" });
});

module.exports = router;
