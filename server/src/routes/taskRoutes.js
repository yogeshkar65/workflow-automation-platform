const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTaskStatus,
  assignTask,
  deleteTask,
} = require("../controllers/taskController");

// ✅ FIXED PATHS (THIS WAS THE CRASH)
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

/* ===== USER ===== */
router.get("/", protect, getTasks);
router.put("/:id/status", protect, updateTaskStatus);

/* ===== ADMIN ===== */
router.post("/", protect, adminOnly, createTask);
router.put("/:id/assign", protect, adminOnly, assignTask);
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;
