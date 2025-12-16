const express = require("express");

const { createTask,getTasks, assignTask, updateTaskStatus } = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createTask);
router.get("/", protect, getTasks);
router.patch("/:id/assign", protect, adminOnly, assignTask);
router.patch("/:id/status", protect, updateTaskStatus);

module.exports = router;
