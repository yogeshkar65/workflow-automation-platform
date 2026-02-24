const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTaskStatus,
  assignTask,
  deleteTask,
} = require("../controllers/taskcontroller");


const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

router.get("/", protect, getTasks);
router.put("/:id/status", protect, updateTaskStatus);

router.post("/", protect, adminOnly, createTask);
router.put("/:id/assign", protect, adminOnly, assignTask);
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;
