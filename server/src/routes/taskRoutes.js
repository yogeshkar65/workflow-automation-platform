const express = require("express");
console.log("✅ taskRoutes REGISTERED");

const { createTask } = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createTask);

module.exports = router;
