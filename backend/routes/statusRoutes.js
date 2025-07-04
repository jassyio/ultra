const express = require("express");
const router = express.Router();
const { getStatuses, addStatus } = require("../controllers/statusController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getStatuses); // Fetch all statuses
router.post("/", authMiddleware, addStatus); // Add a new status

module.exports = router;