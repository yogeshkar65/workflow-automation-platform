const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("_id name email role");
    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;