// File: backend/routes/contactRoutes.js
const express = require("express");
const router = express.Router();

// You’ll need an auth middleware to identify req.user.id
// const auth = require("../middleware/authMiddleware");

// POST /api/contacts
router.post("/", /*auth,*/ async (req, res) => {
  try {
    const { userId } = req.body;
    // TODO: Insert your Contact model logic here
    // e.g. const contact = await Contact.create({ owner: req.user.id, contact: userId });
    res.status(201).json({ success: true /*, contact */ });
  } catch (err) {
    console.error("Error creating contact:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
